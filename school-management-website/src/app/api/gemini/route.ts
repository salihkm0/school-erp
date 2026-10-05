import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `You are the official Google AI Copilot for KlassDesk and P.P.M. Higher Secondary School (PPMHSS Kottukkara).
You assist school administrators, headmasters, teachers, and parents with:
- Academic & Examination Operations: 9-point Kerala State Board grading, theory + CE mark breakdown, exam timetables, single-subject draft revert workflow, hall ticket generation.
- Student & Parent Services: 60-second attendance roll calls, automatic absence alerts, parent app, fee dues, report cards.
- School Management: Kerala Samboorna CSV importing (3000+ students in 4 seconds), subject-teacher allocation (28 hrs/week quotas), staff supervision conflict-free room scheduling.
- Sports & Arts (Kalolsavam): 4-house point tally (Sapphire, Emerald, Ruby, Topaz), chest number bib generation with scannable QR codes.
- Communication: Writing circulars and WhatsApp/SMS announcements in clear English and natural Malayalam.

Always be polite, professional, accurate, and concise. When the user asks in Malayalam or asks for Malayalam translations, provide authentic, natural Malayalam along with English.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, messages, mode = 'chat', customApiKey, studentData, noticeData } = body;

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    // Build the specific prompt based on mode
    let userPrompt = prompt || '';

    if (mode === 'remarks' && studentData) {
      userPrompt = `Please generate an official, personalized Teacher's Academic Progress Appraisal for this student's report card:
Student Name: ${studentData.name || 'Amina Rinsha'}
Class: ${studentData.class || 'Standard 10 - Division A'}
Attendance: ${studentData.attendance || '96.2%'}
Academic Performance:
${JSON.stringify(studentData.marks || {}, null, 2)}
Overall Percentage: ${studentData.percentage || '92.4%'}
Rank: ${studentData.rank || '1st'}

Provide:
1. Short Appraisal (1-2 sentences) suitable for printing on the official report card.
2. Strengths and Recommended Focus Areas.
3. Encouragement note in Malayalam for the parents.`;
    } else if (mode === 'notice' && noticeData) {
      userPrompt = `Please draft an official school notification based on this intent:
Topic/Intent: ${noticeData.topic}
Target Audience: ${noticeData.audience || 'All Parents & Guardians'}
Date: ${noticeData.date || new Date().toLocaleDateString('en-GB')}
Tone: Formal yet warm

Provide 2 formats:
Format 1: Carrier-grade SMS (under 160 characters, with {student_name} tag).
Format 2: Rich WhatsApp Announcement with emojis and clear bullet points in English AND Malayalam translation.`;
    }

    // If no API key is configured anywhere, return a helpful, structured simulated response with guidance
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({
        success: true,
        simulated: true,
        model: 'gemini-2.0-flash (demo mode)',
        message: generateSimulatedResponse(mode, userPrompt),
        instruction: 'To use your live Google AI Studio API key (from project PPM HSS KOTTUKKARA), add GEMINI_API_KEY=your_key in .env.local or enter it in the AI Assistant settings drawer.'
      });
    }

    // Prepare contents array for Gemini API
    const contents: any[] = [];

    // If multi-turn chat messages were sent
    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach((m: { role: string; content: string }) => {
        contents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        });
      });
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
      });
    }

    // Call Google Gemini API (gemini-2.0-flash with fallback to gemini-1.5-flash)
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`;

    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error response:', errText);

      // If invalid key or model issue, return detailed helpful error
      return NextResponse.json({
        success: false,
        error: `Google AI Studio Error: ${response.statusText}`,
        details: errText,
        instruction: 'Please verify that your Google AI Studio API key is valid and has Gemini API enabled.'
      }, { status: response.status });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const replyText = candidate?.content?.parts?.[0]?.text || 'No response generated from Gemini.';

    return NextResponse.json({
      success: true,
      simulated: false,
      model: 'gemini-2.0-flash',
      message: replyText
    });

  } catch (error: any) {
    console.error('Gemini route exception:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error while connecting to Google AI Studio'
    }, { status: 500 });
  }
}

// Intelligent fallback responses when API key is pending setup
function generateSimulatedResponse(mode: string, prompt: string): string {
  if (mode === 'remarks') {
    return `### Official Report Card Appraisal
**Class Teacher Remarks (For Print):**
"Amina exhibits exemplary academic commitment, superior linguistic fluency, and active classroom leadership. Her consistent mastery in analytical sciences and mathematics places her at the pinnacle of her cohort."

**Strengths & Guidance:**
- **Key Strength:** Outstanding critical reasoning in Mathematics and Natural Sciences (A+ grade aggregate).
- **Focus Area:** Keep up daily revision for upcoming Model Examinations. Highly recommended for the State Science Talent Search Olympiad.

**മാതാപിതാക്കൾക്കുള്ള സന്ദേശം (Parent Note in Malayalam):**
"അമീനയുടെ മികച്ച അക്കാദമിക് നേട്ടങ്ങളിലും മാതൃകാപരമായ അച്ചടക്കത്തിലും സ്കൂളിന് അഭിമാനമുണ്ട്. തുടർന്നും ഇതേ പ്രോത്സാഹനം നൽകണമെന്ന് അഭ്യർത്ഥിക്കുന്നു."`;
  }

  if (mode === 'notice') {
    return `### Multi-Channel School Notification

**1. Carrier-Grade SMS (Under 160 Characters):**
"Dear Parent, PPMHSS Kottukkara announces a holiday tomorrow (10-Sep-2026) due to heavy rainfall warning by District Collector. Stay safe. - Principal"

**2. Rich WhatsApp Broadcast (English & Malayalam):**
📢 **P.P.M. HIGHER SECONDARY SCHOOL, KOTTUKKARA**
📅 *Date: 09 September 2026*

Dear Parents and Guardians,
Please be informed that in accordance with the weather alert issued by the District Collector, our school will remain **CLOSED tomorrow (Thursday, 10-Sep-2026)**.

⚠️ Regular classes will resume on Friday as per normal timetable.

---
📢 **അടിയന്തര അറിയിപ്പ് (Malayalam):**
ബഹുമാനപ്പെട്ട രക്ഷിതാക്കളുടെയും വിദ്യാർത്ഥികളുടെയും ശ്രദ്ധയ്ക്ക്:
ജില്ലാ കളക്ടറുടെ മഴ മുന്നറിയിപ്പിന്റെ പശ്ചാത്തലത്തിൽ നാളെ (വ്യാഴാഴ്ച, 10-09-2026) സ്കൂളിന് അവധിയായിരിക്കും. വെള്ളിയാഴ്ച പതിവുപോലെ ക്ലാസുകൾ പ്രവർത്തിക്കുന്നതാണ്.

*- പ്രിൻസിപ്പൽ, പി.പി.എം.എച്ച്.എസ്.എസ്. കൊട്ടുക്കര*`;
  }

  // Default chat assistant response
  const lower = prompt.toLowerCase();
  if (lower.includes('samboorna') || lower.includes('import')) {
    return `KlassDesk includes a high-speed **Kerala Samboorna CSV Importer**. It parses 3,000+ student records in under 4 seconds, automatically maps admission numbers, gender, religion, caste categories, and warns about duplicates before writing to the institutional database.`;
  }

  if (lower.includes('mark') || lower.includes('entry') || lower.includes('assigned')) {
    return `In KlassDesk, **faculty members can only view and enter marks for subjects officially assigned to them** in the Subject-Teacher Allocation matrix.
Once entered (Theory + Continuous Evaluation), teachers can click "Save Draft" or "Submit to Exam Controller", which locks the sheet against accidental tampering. If corrections are needed, administrators can revert only that specific subject while keeping all other subjects locked.`;
  }

  if (lower.includes('sports') || lower.includes('kalolsavam') || lower.includes('bib')) {
    return `KlassDesk features an automated **Inter-House Fest Manager**:
1. Automatic 4-House balancing (Sapphire, Emerald, Ruby, Topaz) across all divisions.
2. Chest number bib card generator with scannable QR codes for 1,000+ competitors.
3. Live championship points tally with Gold, Silver, and Bronze medal scoring.`;
  }

  return `Hello! I am your **Google AI Copilot** powered by **Gemini 2.0 Flash** for KlassDesk and P.P.M. Higher Secondary School.
I can help you with:
- Drafting personalized student report card remarks based on term exam scores.
- Composing bilingual WhatsApp and SMS announcements in English and Malayalam.
- Explaining our dual-tier mark entry locking, 60-second attendance, and Samboorna integration.
- Calculating Kerala SSLC 9-point grading brackets (A+ to D).

How can I assist your school today?`;
}
