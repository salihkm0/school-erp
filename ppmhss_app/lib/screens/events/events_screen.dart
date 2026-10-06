import 'package:flutter/material.dart';
import 'package:school_management/models/fest_event_model.dart';
import 'package:school_management/services/fest_event_service.dart';
import 'package:school_management/utils/theme.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> with SingleTickerProviderStateMixin {
  final FestEventService _eventService = FestEventService();

  bool _isLoading = true;
  List<FestEventModel> _events = [];
  FestEventModel? _selectedEvent;

  List<HouseLeaderboard> _leaderboard = [];
  List<EventItemModel> _items = [];

  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadEvents();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadEvents() async {
    setState(() => _isLoading = true);
    final events = await _eventService.getEvents();
    if (mounted) {
      setState(() {
        _events = events;
        if (_events.isNotEmpty) {
          _selectedEvent = _events.first;
        }
      });
      if (_selectedEvent != null) {
        await _loadEventDetails(_selectedEvent!.id);
      }
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadEventDetails(String eventId) async {
    final [lb, items] = await Future.wait([
      _eventService.getEventLeaderboard(eventId),
      _eventService.getEventItems(eventId),
    ]);

    if (mounted) {
      setState(() {
        _leaderboard = lb as List<HouseLeaderboard>;
        _items = items as List<EventItemModel>;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Events & Fests',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              if (_selectedEvent != null) {
                _loadEventDetails(_selectedEvent!.id);
              } else {
                _loadEvents();
              }
            },
            tooltip: 'Refresh',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: 'House Scoreboard', icon: Icon(Icons.emoji_events_outlined, size: 18)),
            Tab(text: 'Items & Schedule', icon: Icon(Icons.view_timeline_outlined, size: 18)),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
          : _events.isEmpty
              ? _buildEmptyEvents()
              : Column(
                  children: [
                    // Event Selector Bar
                    _buildEventSelector(),

                    // Tab View
                    Expanded(
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          _buildLeaderboardTab(),
                          _buildItemsTab(),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildEmptyEvents() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.emoji_events_outlined, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text(
            'No sports or arts fests active right now',
            style: TextStyle(color: Colors.grey, fontSize: 15, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildEventSelector() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          const Icon(Icons.event_note, color: AppTheme.primaryColor, size: 20),
          const SizedBox(width: 8),
          const Text('Event:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedEvent?.id,
                  isExpanded: true,
                  items: _events.map((e) {
                    return DropdownMenuItem<String>(
                      value: e.id,
                      child: Text(
                        '${e.name} (${e.type.toUpperCase()})',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      final found = _events.firstWhere((e) => e.id == val);
                      setState(() => _selectedEvent = found);
                      _loadEventDetails(val);
                    }
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboardTab() {
    if (_leaderboard.isEmpty) {
      return Center(
        child: Text(
          'No points recorded yet for this event.',
          style: TextStyle(color: Colors.grey[600], fontSize: 13),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Podium for Top 3
        if (_leaderboard.length >= 2)
          _buildPodiumView(),

        const SizedBox(height: 16),
        const Text(
          'Overall House Standing',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        ),
        const SizedBox(height: 12),

        ..._leaderboard.map((house) {
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
              border: Border.all(color: Colors.grey[100]!),
            ),
            child: Row(
              children: [
                // Rank Circle
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: house.rank == 1
                        ? const Color(0xFFFBBF24)
                        : house.rank == 2
                            ? Colors.grey[400]
                            : house.rank == 3
                                ? const Color(0xFFD97706)
                                : Colors.grey[100],
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      '#${house.rank}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        color: house.rank <= 3 ? Colors.white : Colors.grey[700],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 14),

                // House Name
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        house.houseName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        '1st: ${house.firstPlaces} • 2nd: ${house.secondPlaces} • 3rd: ${house.thirdPlaces}',
                        style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                      ),
                    ],
                  ),
                ),

                // Total Points
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${house.points} pts',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildPodiumView() {
    final first = _leaderboard.isNotEmpty ? _leaderboard[0] : null;
    final second = _leaderboard.length > 1 ? _leaderboard[1] : null;
    final third = _leaderboard.length > 2 ? _leaderboard[2] : null;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryColor.withOpacity(0.05),
            Colors.white,
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // 2nd Place
          if (second != null)
            _buildPodiumColumn(second, 2, 85, Colors.grey[400]!, '🥈'),

          // 1st Place
          if (first != null)
            _buildPodiumColumn(first, 1, 115, const Color(0xFFFBBF24), '👑'),

          // 3rd Place
          if (third != null)
            _buildPodiumColumn(third, 3, 70, const Color(0xFFD97706), '🥉'),
        ],
      ),
    );
  }

  Widget _buildPodiumColumn(HouseLeaderboard house, int rank, double height, Color badgeColor, String medal) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(medal, style: const TextStyle(fontSize: 22)),
        const SizedBox(height: 4),
        Text(
          house.houseName,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        Text(
          '${house.points} pts',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey[600]),
        ),
        const SizedBox(height: 6),
        Container(
          width: 75,
          height: height,
          decoration: BoxDecoration(
            color: badgeColor.withOpacity(0.2),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            border: Border.all(color: badgeColor.withOpacity(0.5)),
          ),
          child: Center(
            child: Text(
              '#$rank',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: badgeColor),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildItemsTab() {
    if (_items.isEmpty) {
      return Center(
        child: Text(
          'No scheduled items found.',
          style: TextStyle(color: Colors.grey[600], fontSize: 13),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _items.length,
      itemBuilder: (context, index) {
        final item = _items[index];
        final isOngoing = item.liveStatus == 'ongoing';
        final isCompleted = item.liveStatus == 'completed';

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
            border: Border.all(
              color: isOngoing ? Colors.amber[300]! : Colors.grey[100]!,
              width: isOngoing ? 1.5 : 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      item.code.isNotEmpty ? item.code : 'ITEM',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.primaryColor),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isOngoing
                          ? Colors.amber[50]
                          : isCompleted
                              ? Colors.green[50]
                              : Colors.blue[50],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      item.liveStatus.toUpperCase(),
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isOngoing
                            ? Colors.amber[800]
                            : isCompleted
                                ? Colors.green[800]
                                : Colors.blue[800],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                item.name,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.theater_comedy, size: 14, color: Colors.grey[500]),
                  const SizedBox(width: 4),
                  Text(
                    item.stageNumber,
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  const SizedBox(width: 12),
                  Icon(Icons.category, size: 14, color: Colors.grey[500]),
                  const SizedBox(width: 4),
                  Text(
                    item.category,
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
