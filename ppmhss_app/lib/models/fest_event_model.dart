class FestEventModel {
  final String id;
  final String name;
  final String type; // 'sports' | 'arts' | 'annual_day' | 'exhibition' | 'other'
  final String academicYear;
  final DateTime? startDate;
  final DateTime? endDate;
  final String status; // 'draft' | 'registration_open' | 'ongoing' | 'completed' | 'published'
  final List<dynamic> houses;
  final String? bannerUrl;

  FestEventModel({
    required this.id,
    required this.name,
    required this.type,
    required this.academicYear,
    this.startDate,
    this.endDate,
    required this.status,
    required this.houses,
    this.bannerUrl,
  });

  factory FestEventModel.fromJson(Map<String, dynamic> json) {
    return FestEventModel(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Event / Fest',
      type: json['type']?.toString() ?? 'sports',
      academicYear: json['academicYearId'] is Map
          ? json['academicYearId']['year']?.toString() ?? ''
          : json['academicYear']?.toString() ?? '',
      startDate: json['startDate'] != null ? DateTime.tryParse(json['startDate'].toString()) : null,
      endDate: json['endDate'] != null ? DateTime.tryParse(json['endDate'].toString()) : null,
      status: json['status']?.toString() ?? 'ongoing',
      houses: json['houses'] as List? ?? [],
      bannerUrl: json['bannerUrl']?.toString(),
    );
  }
}

class HouseLeaderboard {
  final String houseName;
  final String color;
  final int points;
  final int rank;
  final int firstPlaces;
  final int secondPlaces;
  final int thirdPlaces;

  HouseLeaderboard({
    required this.houseName,
    required this.color,
    required this.points,
    required this.rank,
    required this.firstPlaces,
    required this.secondPlaces,
    required this.thirdPlaces,
  });

  factory HouseLeaderboard.fromJson(Map<String, dynamic> json, int defaultRank) {
    return HouseLeaderboard(
      houseName: json['houseName']?.toString() ?? json['name']?.toString() ?? 'House',
      color: json['color']?.toString() ?? '#3B82F6',
      points: json['points'] is int ? json['points'] : int.tryParse(json['points']?.toString() ?? '0') ?? 0,
      rank: json['rank'] is int ? json['rank'] : defaultRank,
      firstPlaces: json['firstPlaces'] is int ? json['firstPlaces'] : int.tryParse(json['firstPlaces']?.toString() ?? '0') ?? 0,
      secondPlaces: json['secondPlaces'] is int ? json['secondPlaces'] : int.tryParse(json['secondPlaces']?.toString() ?? '0') ?? 0,
      thirdPlaces: json['thirdPlaces'] is int ? json['thirdPlaces'] : int.tryParse(json['thirdPlaces']?.toString() ?? '0') ?? 0,
    );
  }
}

class EventItemModel {
  final String id;
  final String code;
  final String name;
  final String category;
  final String type;
  final String stageNumber;
  final String liveStatus; // 'upcoming' | 'ongoing' | 'completed'
  final String? winner;

  EventItemModel({
    required this.id,
    required this.code,
    required this.name,
    required this.category,
    required this.type,
    required this.stageNumber,
    required this.liveStatus,
    this.winner,
  });

  factory EventItemModel.fromJson(Map<String, dynamic> json) {
    return EventItemModel(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      code: json['code']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Competition Item',
      category: json['category']?.toString() ?? 'General',
      type: json['type']?.toString() ?? 'individual',
      stageNumber: json['stageNumber']?.toString() ?? 'Stage 1',
      liveStatus: json['liveStatus']?.toString() ?? 'upcoming',
      winner: json['winner']?.toString(),
    );
  }
}
