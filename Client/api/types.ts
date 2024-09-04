export interface CleaningTaskList {
  cleaningtasklistid: number;
  _date: Date;
  managersignature: string | null;
  staffmembersignature: string | null;
  staffmemberid: number | null;
}

export interface CleaningTaskListWithStaffMember extends CleaningTaskList {
  staffMemberFirstName?: string;
  staffMemberLastName?: string;
}

export type GetCleaningTaskList = {
  cleaningTaskList: CleaningTaskList;
};

export type CleaningTaskLists = {
  cleaningTaskLists: Array<CleaningTaskList>;
};

export type CleaningTask = {
  cleaningtaskid: number;
  cleaningtaskdescription: string;
  completed: boolean;
  cleaningtasklistid: number;
  areaid: number;
  areadescription: string;
};

export type CleaningTasks = {
  cleaningTasks: Array<CleaningTask>;
};

export type AddCleaningTaskResponse = {
  cleaningTaskId: number;
};

export type CleaningTaskTemplate = {
  cleaningtasktemplateid: number;
  cleaningtasktemplatedescription: string;
  areaid: number;
  areadescription: string;
};

export type CleaningTaskTemplates = {
  cleaningTaskTemplates: Array<CleaningTaskTemplate>;
};

export type Area = {
  areaid: number;
  _description: string;
};

export type Areas = {
  areas: Array<Area>;
};

export type CleaningTaskTemplateList = {
  cleaningtasktemplatelistid: number;
  title: string;
};

export type CleaningTaskTemplateLists = {
  cleaningTaskTemplateLists: Array<CleaningTaskTemplateList>;
};

export type StaffMember = {
  firstName: string;
  lastName: string;
  payrollNumber: number;
};

export type StaffMembers = {
  staffMembers: Array<StaffMember>;
};

export type CleaningTaskListId = {
  cleaningTaskListId: number;
};

export type Error_ = {
  message: string;
  statusCode?: number;
};

export type GetCleaningTaskTemplateList = {
  cleaningTaskTemplateList: CleaningTaskTemplateList;
};

export type CreateCleaningTaskTemplateListResponse = {
  cleaningTaskTemplateListId: number;
};

export type CreateCleaningTaskTemplateResponse = {
  cleaningTaskTemplateId: number;
};
