module.exports = async function (context, req) {
  const appointments = [
    {
      id: 1,
      studentName: "John Doe",
      counselorName: "Dr. Smith",
      date: "2025-10-05",
      time: "10:00 AM",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      counselorName: "Dr. Johnson",
      date: "2025-10-06",
      time: "02:00 PM",
    },
  ];

  context.res.json(appointments);
};
//checking git integration