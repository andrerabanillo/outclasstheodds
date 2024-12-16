import React, { useState, useEffect } from "react";

const App = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setSubscribed] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 5,
    minutes: 27,
    seconds: 0,
  });

  // Countdown timer logic
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        const { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(countdown);
        return prev;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleButtonClick = () => {
    setFormVisible(true);
    setSubscribed(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setFormVisible(false);
  };

  return (
    <div className="relative bg-dark-blue min-h-screen text-white font-sans overflow-hidden">
      {/* Background Highlights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-96 h-96 bg-accent-green opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-green-dark opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-green-bright opacity-20 blur-[150px] rounded-full"></div>
      </div>

      {/* Main Content Centered */}
      <div className="flex flex-col items-center justify-center min-h-screen z-10 text-center px-4">
        <h1 className="text-6xl font-extrabold text-accent-green mb-4">Outclass the Odds</h1>
        <p className="text-lg mb-8 text-gray-300">Bet Smarter. Win Bigger.</p>

        {/* Countdown Timer */}
        <div className="flex space-x-12 text-center text-3xl font-bold mb-12">
          {["Days", "Hours", "Minutes", "Seconds"].map((label, index) => {
            const timeValues = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];
            return (
              <div key={label} className="flex flex-col items-center">
                <span className="text-accent-green text-6xl">{timeValues[index]}</span>
                <span className="text-gray-400 text-sm">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Call-to-Action */}
        <div className="mt-12 min-h-[120px] flex items-center justify-center">
          {!isFormVisible && !isSubscribed ? (
            <button
              onClick={handleButtonClick}
              className="px-8 py-4 bg-accent-green hover:bg-accent-green-dark text-black font-bold rounded-md transition-all shadow-lg shadow-accent-green/50"
            >
              Be the First to Know
            </button>
          ) : isFormVisible ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 animate-fade-in-smooth">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 w-72 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green"
                required
              />
              <button type="submit" className="px-8 py-3 bg-accent-green hover:bg-accent-green-dark text-black font-bold rounded-md transition-all shadow-lg shadow-accent-green/50">
                Submit
              </button>
            </form>
          ) : (
            <div className="text-accent-green-light text-center animate-fade-in-smooth">
              Thank you for subscribing! Stay tuned for updates.
            </div>
          )}
        </div>
      </div>

      {/* Transparent Footer */}
      <footer className="absolute bottom-0 w-full text-gray-500 text-sm text-center p-4 bg-dark-blue/80 backdrop-blur-lg">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-accent-green">Twitter</a>
          <a href="#" className="hover:text-accent-green">Instagram</a>
          <a href="#" className="hover:text-accent-green">Discord</a>
        </div>
        <p>© 2024 Outclass the Odds. Bet Responsibly.</p>
      </footer>
    </div>
  );
};

export default App;
