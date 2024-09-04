BEGIN;

-- CleaningTasksList Relation
CREATE TABLE CleaningTaskList (
  cleaningTaskListId SERIAL PRIMARY KEY,
  _date DATE NOT NULL,
  managerSignature VARCHAR(30),
  staffMemberSignature VARCHAR(30),
  staffMemberId INTEGER
);

-- CleaningTask Relation
CREATE TABLE CleaningTask (
  cleaningTaskId SERIAL PRIMARY KEY,
  _description VARCHAR(200) NOT NULL,
  completed BOOLEAN NOT NULL,
  cleaningTaskListId INTEGER NOT NULL,
  areaId INTEGER NOT NULL,
  CONSTRAINT fk_CleaningTaskToCleaningTaskList FOREIGN KEY (cleaningTaskListId) REFERENCES CleaningTaskList(cleaningTaskListId) ON DELETE CASCADE
);

-- Area Relation
CREATE TABLE Area (
  areaId SERIAL PRIMARY KEY,
  _description VARCHAR(200) NOT NULL UNIQUE
);

-- Add foreign key to CleaningTask relation that references Area.
ALTER TABLE CleaningTask
ADD CONSTRAINT fk_CleaningTaskToArea
FOREIGN KEY (areaId) REFERENCES Area(areaId);

-- CleaningTaskTemplate relation
CREATE TABLE CleaningTaskTemplate (
  cleaningTaskTemplateId SERIAL PRIMARY KEY,
  _description VARCHAR(200) NOT NULL,
  areaId INTEGER NOT NULL,
  CONSTRAINT fk_CleaningTaskTemplateToArea FOREIGN KEY (areaId) REFERENCES Area(areaId)
);

-- CleaningTaskTemplatesList relation
CREATE TABLE CleaningTaskTemplateList (
  cleaningTaskTemplateListId SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL
);

-- CleaningTaskTemplatesListToCleaningTaskTemplate composite entity to represent the many-to-many relationship between
-- CleaningTaskTemplatesList and CleaningTaskTemplate
CREATE TABLE CleaningTaskTemplateListToCleaningTaskTemplate (
  cleaningTaskTemplateListId INTEGER,
  cleaningTaskTemplateId INTEGER,
  PRIMARY KEY (cleaningTaskTemplateListId, cleaningTaskTemplateId), -- composite primary key
  CONSTRAINT fk_CleaningTaskTemplateList FOREIGN KEY (cleaningTaskTemplateListId)
    REFERENCES CleaningTaskTemplateList(cleaningTaskTemplateListId) ON DELETE CASCADE,
  CONSTRAINT fk_CleaningTaskTemplate FOREIGN KEY (cleaningTaskTemplateId) REFERENCES CleaningTaskTemplate(cleaningTaskTemplateId)
);

COMMIT;
