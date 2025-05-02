const calculateDaysRemaining = (targetDateString) => {
  const targetDate = new Date(targetDateString);
  const currentDate = new Date();
  const timeDifference = targetDate - currentDate;
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Trả về số ngày còn lại
};

export default calculateDaysRemaining;
