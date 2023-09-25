const tasksValidators = require('./tasksValidators'); // Adjust the path as needed

describe('Tasks Validation Functions', () => {
  describe('isManager', () => {
    test('should return true for role Manager', () => {
      expect(tasksValidators.isManager('Manager')).toBe(true);
    });

    test('should return false for role other than Manager', () => {
      expect(tasksValidators.isManager('Employee')).toBe(false);
    });
  });

  describe('areInputsValid', () => {
    test.each([
      [false, 'Task 1', ''],
      [false, '', 'Task Description'],
      [false, '', ''],
      [true, 'Task 1', 'Task Description']
    ])(
      'should return %p when task name="%s", description="%s"',
      (expectedResult, taskName, description) => {
        const result = tasksValidators.areInputsValid(taskName, description);

        expect(result).toBe(expectedResult);
      }
    );
  });

  describe('isDescriptionTooBig', () => {
    test.each([
      [true, 'greater than', 'A'.repeat(2501)],
      [false, 'equal to', 'A'.repeat(2500)],
      [false, 'less than', 'A'.repeat(2499)]
    ])(
      'should return %p when description length is %s 2500',
      (expectedResult, conditionalText, description) => {
        const result = tasksValidators.isDescriptionTooBig(description);

        expect(result).toBe(expectedResult);
      }
    );
  });

  describe('doesTaskExist', () => {
    test.each([
      [true, 'task array is not empty', [{ taskID: 1, taskName: 'Task 1' }]],
      [false, 'task array is empty', []]
    ])(
      'should return %p when %s',
      (expectedResult, scenarioDescription, taskArray) => {
        const result = tasksValidators.doesTaskExist(taskArray);

        expect(result).toBe(expectedResult);
      }
    );
  });

  describe('wasTaskUpdated', () => {
    test.each([
      [true, 1],
      [false, 0]
    ])(
      'should return %p when number of affected rows is %i',
      (expectedResult, taskArray) => {
        const result = tasksValidators.wasTaskUpdated(taskArray);

        expect(result).toBe(expectedResult);
      }
    );
  });
});
