describe('Test Phone Numbers', () => {
  // const pattern = /^((\+|00)[1-9]\d{0,3}|0 ?[1-9]|\(00? ?[1-9][\d ]*\))[\d-/ ]*$/;
  // const regex = new RegExp(pattern);
  const newPattern = /^\+?[1-9]\d{4,14}$/;
  const regex = new RegExp(newPattern);

  it('should identify the number as phone number', () => {
    const phoneNumbers = [
      '+49 7946 989621',
      '0049 7946 989621',
      '+497946989621',
      '00497946989621',
      '+49    7946   989621',
      '00 49 79 46 989 62 1',
      '0049 07946 989621',
      '0049 (07946) 989621'
    ];
    phoneNumbers
      .map(n => n.replace(/\s+/g, ''))
      .map(n => n.replace(/^00/, '+'))
      .map(n => n.substring(0, 1).concat(n.substring(1).replace(/[^a-zA-Z0-9]/g, '')))
      .forEach(n => expect(regex.test(n)).toBeTruthy());
  });
});
