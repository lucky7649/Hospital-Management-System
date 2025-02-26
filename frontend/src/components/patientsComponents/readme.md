     book appointment form-----------
     
     
     <div className="w-full md:w-1/3  rounded-xl bg-white p-2 md:p-4">
        <h1 className="text-xl md:text-3xl font-bold text-gray-600 mb-2 md:mb-4">
          Book Your <span className="text-blue-500">Appointment </span>– Fast,
          Easy & Secure
        </h1>
        <p className="text-xs md:text-lg text-gray-500 mb-4">
          Easily schedule an appointment with our expert doctors. Select your
          preferred date, time, and specialist, and get instant confirmation.
        </p>
        <Calendar />
      </div>
      <div className="w-full">
        <div className="w-full h-full mx-auto p-2 md:p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-4">
            Book an <span className="text-blue-500">Appointment </span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <h1 className="text-lg md:text-xl text-gray-500 font-semibold">
              Personal Information
            </h1>
            <div className="flex w-full gap-2 md:gap-4 items-center ">
              {/* Patient Name Field */}

              <input
                type="text"
                id="patientName"
                value={patientName}
                placeholder="Enter your name..."
                onChange={(e) => setPatientName(e.target.value)}
                className="p-2 text-sm md:text-base border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />

              {/* Patient Age Field */}

              <input
                type="number"
                id="patientAge"
                value={patientAge}
                placeholder="Enter your age..."
                onChange={(e) => setPatientAge(e.target.value)}
                className="p-2 text-sm md:text-base border w-3/6 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex w-full gap-2 md:gap-4 items-center ">
              {/* Gender Field */}

              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="p-2 text-sm md:text-base border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {/* Date of Birth Field */}

              <input
                type="date"
                id="dateOfBirth"
                value={dateOfBirth}
                placeholder="Select your DOB..."
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="p-2 text-sm md:text-base border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <h1 className="text-lg md:text-xl text-gray-500 font-semibold">
              Contact Inforamtaions
            </h1>
            <div className="flex flex-col gap-2 md:gap-4">
              {/* Contact Number Field */}
              <div className="flex flex-col">
                <input
                  type="text"
                  id="contactNumber"
                  value={contactNumber}
                  placeholder="Phone No"
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="p-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Reason for Visit Field */}
            <h1 className="text-lg md:text-xl text-gray-500 font-semibold">
              Reason for Visit
            </h1>
            <div className="flex flex-col">
              <textarea
                type="text"
                id="reasonForVisit"
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                className="p-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Mode of Appointment */}
            <h1 className="text-lg md:text-xl text-gray-500 font-semibold">
              Mode of Appointment
            </h1>
            <div className="flex flex-col bg-gray-100 rounded-xl p-4">
              <div className="flex space-x-4">
                <div>
                  <input
                    type="radio"
                    id="inPerson"
                    name="mode"
                    value="in-person"
                    checked={mode === "in-person"}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="inPerson">In-person</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="online"
                    name="mode"
                    value="online"
                    checked={mode === "online"}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="online">Online</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full items-center">
              {/*Appointment Date Field */}
              <div className="flex w-full flex-col">
                <label htmlFor="appointmentDate" className="text-gray-700 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="p-2 text-sm md:text-base border w-full border-gray-300 rounded-md outline-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Doctor Selection Field */}
              <div className="flex w-full flex-col">
                <label htmlFor="doctor" className="text-gray-700 mb-1">
                  Doctor:
                </label>
                <select
                  id="doctor"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="p-2 text-sm md:text-base border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name || "Unknown Doctor"} -{" "}
                      {doctor.specialization || "Specialization not provided"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 md:gap-4 mt-4">
              <button
                onClick={handleReset}
                className="w-1/2 py-2 px-1 md:py-2 text-sm md:text-base bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-200"
              >
                Reset Form
              </button>
              <button
                type="submit"
               
                onClick={handleSubmit}
                className="w-full py-2 px-1 md:py-2 bg-blue-500 text-white text-sm md:text-base font-semibold rounded-md hover:bg-blue-600 transition duration-200"
              >
                Book Appointment
              </button>
            </div>
          </form>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-80 md:w-96 p-3 md:p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-lg md:text-xl flex flex-col items-center justify-center font-bold text-center text-green-500">
                  <img
                    src="/assets/check.png"
                    alt="check"
                    className="w-24 mb-3"
                  />
                  Booking Successful!
                </h2>
                <p className="mt-2 mb:mt-4 text-center text-gray-700">
                  Your appointment has been successfully booked.
                </p>
                <div className="mt-3 md:mt-6 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>





       {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2 rounded-full border transition-all ${
                          selectedTime === slot.time
                            ? "bg-blue-500 text-white border border-blue-600 shadow-md"
                            : slot.isBooked
                            ? "bg-red-100 text-red-500 border border-red-500 cursor-not-allowed"
                            : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                        disabled={slot.isBooked} // Disable button if the slot is booked
                      >
                        {slot.time} {/* Render the time property */}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-3 w-full h-40 flex items-center justify-center text-gray-500 text-center">
                      No available slots for this day.
                    </p>
                  )}