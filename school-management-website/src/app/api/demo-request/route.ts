import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface DemoRequestBody {
  fullName: string;
  schoolName: string;
  email: string;
  phone: string;
  role: string;
  studentCount: string;
  preferredDate?: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const body: DemoRequestBody = await request.json();

    // Validation
    if (!body.fullName || !body.schoolName || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name, school name, valid email, and phone number.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const leadRecord = {
      id: `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      receivedAt: new Date().toISOString(),
      fullName: body.fullName.trim(),
      schoolName: body.schoolName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      role: body.role || 'Principal / Administrator',
      studentCount: body.studentCount || '500 - 1500',
      preferredDate: body.preferredDate || null,
      notes: body.notes?.trim() || null,
      status: 'pending_contact'
    };

    // Store in local JSON data file for persistence
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const leadsFilePath = path.join(dataDir, 'leads.json');
      let existingLeads = [];
      if (fs.existsSync(leadsFilePath)) {
        const fileData = fs.readFileSync(leadsFilePath, 'utf8');
        try {
          existingLeads = JSON.parse(fileData);
        } catch {
          existingLeads = [];
        }
      }
      existingLeads.unshift(leadRecord);
      fs.writeFileSync(leadsFilePath, JSON.stringify(existingLeads, null, 2), 'utf8');
    } catch (err) {
      console.warn('Could not persist to file system (non-fatal):', err);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Thank you, ${body.fullName}! Your demo request for ${body.schoolName} has been received. Our senior education specialist will contact you within 2 business hours.`,
        leadId: leadRecord.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API demo-request error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
