class SchoolProfileModel {
  final String name;
  final String shortName;
  final String code;
  final String affiliation;
  final String tagline;
  final String street;
  final String city;
  final String district;
  final String state;
  final String pincode;
  final String phone;
  final String alternatePhone;
  final String email;
  final String website;
  final String logoUrl;
  final String principalSignatureUrl;
  final String principalName;
  final String headmasterName;

  SchoolProfileModel({
    this.name = 'School Management',
    this.shortName = 'SMS',
    this.code = '',
    this.affiliation = '',
    this.tagline = '',
    this.street = '',
    this.city = '',
    this.district = '',
    this.state = '',
    this.pincode = '',
    this.phone = '',
    this.alternatePhone = '',
    this.email = '',
    this.website = '',
    this.logoUrl = '',
    this.principalSignatureUrl = '',
    this.principalName = '',
    this.headmasterName = '',
  });

  factory SchoolProfileModel.fromJson(Map<String, dynamic> json) {
    final address = json['address'] is Map ? json['address'] : {};
    final contact = json['contact'] is Map ? json['contact'] : {};
    final branding = json['branding'] is Map ? json['branding'] : {};
    final personnel = json['keyPersonnel'] is Map ? json['keyPersonnel'] : {};

    return SchoolProfileModel(
      name: json['name'] ?? 'School Management',
      shortName: json['shortName'] ?? '',
      code: json['code'] ?? '',
      affiliation: json['affiliation'] ?? '',
      tagline: json['tagline'] ?? '',
      street: address['street'] ?? '',
      city: address['city'] ?? '',
      district: address['district'] ?? '',
      state: address['state'] ?? '',
      pincode: address['pincode'] ?? '',
      phone: contact['phone'] ?? '',
      alternatePhone: contact['alternatePhone'] ?? '',
      email: contact['email'] ?? '',
      website: contact['website'] ?? '',
      logoUrl: branding['logoUrl'] ?? '',
      principalSignatureUrl: branding['principalSignatureUrl'] ?? '',
      principalName: personnel['principalName'] ?? '',
      headmasterName: personnel['headmasterName'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'shortName': shortName,
      'code': code,
      'affiliation': affiliation,
      'tagline': tagline,
      'address': {
        'street': street,
        'city': city,
        'district': district,
        'state': state,
        'pincode': pincode,
      },
      'contact': {
        'phone': phone,
        'alternatePhone': alternatePhone,
        'email': email,
        'website': website,
      },
      'branding': {
        'logoUrl': logoUrl,
        'principalSignatureUrl': principalSignatureUrl,
      },
      'keyPersonnel': {
        'principalName': principalName,
        'headmasterName': headmasterName,
      },
    };
  }
}
