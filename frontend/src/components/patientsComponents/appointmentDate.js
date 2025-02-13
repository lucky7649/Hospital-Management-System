import { useState, useEffect } from "react";

const DateList = () => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const today = new Date();
    const nextDates = [];

    for (let i = 0; i < 10; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      const formattedDate = nextDate.toDateString(); // Example: "Mon Feb 19 2025"
      nextDates.push(formattedDate);
    }

    setDates(nextDates);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Next 10 Dates</h2>
      <ul className="list-disc pl-5">
        {dates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>
    </div>
  );
};

export default DateList;
