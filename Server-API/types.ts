export type CleaningTaskTemplateList_TYPE = {
  cleaningtasktemplatelistid: number;
  title: string;
};

export type CleaningTaskTemplateLists_TYPE = Array<CleaningTaskTemplateList_TYPE>;

export type CleaningTaskTemplate_TYPE = {
  cleaningtasktemplateid: number;
  _description: string;
  areaid: number;
};

export type CleaningTaskTemplates_TYPE = Array<CleaningTaskTemplate_TYPE>;

export type Area_TYPE = {
  areaid: number;
  _description: string;
};

export type Areas_TYPE = Array<Area_TYPE>;

export type CleaningTaskList_TYPE = {
  cleaningtasklistid: number;
  _date: Date;
  managersignature: string | null;
  staffmembersignature: string | null;
  staffmemberid: number | null;
};

export type CleaningTaskLists_TYPE = Array<CleaningTaskList_TYPE>;

export type CleaningTask_TYPE = {
  cleaningtaskid: number;
  _description: string;
  completed: boolean;
  cleaningtasklistid: number;
  areaid: number;
};

export type CleaningTasks_TYPE = Array<CleaningTask_TYPE>;

export type CleaningTaskWithArea = {
  cleaningtaskid: number;
  cleaningtaskdescription: string;
  completed: boolean;
  cleaningtasklistid: number;
  areaid: number;
  areadescription: string;
};

export type CleaningTaskTemplateWithArea = {
  cleaningtasktemplateid: number;
  cleaningtasktemplatedescription: string;
  areaid: number;
  areadescription: string;
};

export type StaffMember = {
  firstName: string;
  lastName: string;
  payrollNumber: number;
};
