const snoozeOneDay = () => {
    const startSnooze = new Date();
    const startSnoozeUTC = startSnooze.getTime();
    let endOfSnoozeUTC = startSnooze.setDate(startSnooze.getDate() + 1);
    console.log(startSnoozeUTC, endOfSnoozeUTC);

    chrome.storage.local.set(
      { snoozeStart: startSnoozeUTC, snoozeEnd: endOfSnoozeUTC },
      () => {}
    );
  };

describe('snoozeOneDay', () => {
  test('sets snoozeStart and snoozeEnd in local storage', () => {
    // Arrange
    chrome.storage.local.get = jest.fn();
    chrome.storage.local.set = jest.fn();

    // Act
    snoozeOneDay();

    // Assert
    expect(chrome.storage.local.set).toHaveBeenCalled();
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      snoozeStart: expect.any(Number),
      snoozeEnd: expect.any(Number),
    }, expect.any(Function));
  });
});