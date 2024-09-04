BEGIN;

-- Insert data into CleaningTasksList
INSERT INTO CleaningTaskList (_date, managerSignature, staffMemberSignature, staffMemberId)
VALUES 
('2023-06-17', NULL, NULL, 1),
('2023-06-18', 'Manager A', 'Staff B', 2),
('2023-06-19', NULL, 'Staff C', 3),
('2023-06-20', NULL, NULL, 4),
('2023-06-21', NULL, 'Staff E', 5),
('2023-06-22', NULL, NULL, 6),
('2023-06-23', NULL, 'Staff G', 7),
('2023-06-24', NULL, NULL, 8),
('2023-06-25', 'Manager C', 'Staff I', 9),
('2023-06-26', NULL, NULL, 10);


-- Insert data into Area
INSERT INTO Area (_description)
VALUES 
('Lobby'),
('Conference Room'),
('Restrooms'),
('Kitchen'),
('Office'),
('Gym'),
('Parking Lot'),
('Entrance'),
('Storage Room'),
('Hallways');

-- Insert data into CleaningTask
INSERT INTO CleaningTask (_description, completed, cleaningTaskListId, areaId)
VALUES 
('Hoover floor', FALSE, 1, 1),
('Clean surfaces', FALSE, 3, 1),
('Clean touch points', FALSE, 5, 1),
('Clean skirting boards', FALSE, 7, 1),

('Hoover floor', TRUE, 2, 2),
('Mop floor', TRUE, 9, 2),
('Clean tables', FALSE, 10, 2),
('Clean touch points', TRUE, 6, 2),

('Sweep floor', FALSE, 3, 3),
('Mop floor', TRUE, 8, 3),
('Clean toilets', FALSE, 3, 3),
('Clean sinks', FALSE, 2, 3),
('Clean mirrors', TRUE, 1, 3),

('Sweep floor', TRUE, 4, 4),
('Mop floor', FALSE, 6, 4),
('Clean ovens', TRUE, 7, 4),


('Hoover floor', FALSE, 5, 5),
('Clean phones', FALSE, 3, 5),
('Clean desks', TRUE, 10, 5),

('Hoover floors', TRUE, 6, 6),
('Clean exercise bikes', FALSE, 8, 6),
('Clean treadmills', FALSE, 5, 6),
('Mop floors', TRUE, 7, 6),
('Clean weights', FALSE, 4, 6),

('Litter pick', FALSE, 7, 7),

('Hoover floors', TRUE, 8, 8),
('Clean glass', FALSE, 2, 8),

('Hoover floors', FALSE, 9, 9),
('Dust high level surfaces', TRUE, 7, 9),

('Hoover floors', TRUE, 10, 10),
('Dust high level surfaces', FALSE, 3, 10),
('Clean touch points', TRUE, 5, 10),
('Clean skirting boards', FALSE, 1, 10);

-- Insert data into CleaningTaskTemplate
INSERT INTO CleaningTaskTemplate (_description, areaId)
VALUES 
('Hoover floor', 1),
('Clean skirting boards', 1),

('Hoover floor', 2),
('Mop floor', 2),

('Clean toilets', 3),
('Clean sinks', 3),
('Clean mirrors', 3),

('Sweep floor', 4),
('Clean ovens', 4),


('Hoover floor', 5),
('Clean phones', 5),
('Clean desks', 5),

('Hoover floors', 6),
('Clean weights', 6),

('Litter pick', 7),

('Hoover floors', 8),
('Clean glass', 8),

('Hoover floors', 9),
('Dust high level surfaces', 9),

('Hoover floors', 10),
('Clean skirting boards', 10);

-- Insert data into CleaningTaskTemplatesList
INSERT INTO CleaningTaskTemplateList (title)
VALUES 
('Mondays AM'),
('Tuesdays AM'),
('Tuesdays PM'),
('Wednesday PM'),
('Thursday AM'),
('Friday AM'),
('Friday PM'),
('Saturday AM'),
('Saturday PM'),
('Sunday AM');

-- Insert data into CleaningTaskTemplatesListToCleaningTaskTemplate
INSERT INTO CleaningTaskTemplateListToCleaningTaskTemplate (cleaningTaskTemplateListId, cleaningTaskTemplateId)
VALUES 
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8),
(5, 9),
(5, 10);

COMMIT;