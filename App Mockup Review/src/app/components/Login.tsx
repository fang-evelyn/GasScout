import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppContextType } from '../App';

export function Login({ context }: { context: AppContextType }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    context.login(email, password);
    navigate('/getting-started');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-[28px] font-medium text-[#191919]">FuelWise</h1>
          <p className="text-sm text-[#CED0CE]">Smart Gas & EV Station Finder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-[#CED0CE] rounded-xl text-[#191919] placeholder:text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#CED0CE] rounded-xl text-[#191919] placeholder:text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#F15025] text-white rounded-xl hover:bg-[#d9471f] transition-colors"
          >
            Sign In
          </button>
        </form>

        <button className="w-full text-sm text-[#F15025]">
          Create an account
        </button>
      </div>
    </div>
  );
}
