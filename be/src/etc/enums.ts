export enum RoleEnum {
  ADMIN = 'Admin',
  STUDENT = 'Student',
}

export enum FileTypeAllowEnum {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  JPG = 'image/jpg',
  SVG = 'image/svg',
  GIF = 'image/gif',
}

export enum RoomTypeEnum {
  HOMEWORK = 'Homework',
  ESSAY = 'Essay',
  MULTIPLE_CHOICE_SIMPLE = 'Multiple Choice Simple',
  MULTIPLE_CHOICE_COMPLEX = 'Multiple Choice Complex',
}

export enum RoomFilterTypeEnum {
  ALL = 'All',
  SUBMITTED = 'Submitted',
  NOT_SUBMITTED_YET = 'Not Submitted Yet',
  GRADED = 'Graded',
  NOT_GRADED_YET = 'Not Graded Yet',
}

export enum SubmitFilterTypeEnum {
  ALL = 'All',
  GRADED = 'Graded',
  NOT_GRADED_YET = 'Not Graded Yet',
}
