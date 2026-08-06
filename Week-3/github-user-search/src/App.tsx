import { useState } from 'react'

type GitHubUser = {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
};

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUser(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);

      if (!response.ok) {
        throw new Error('User not found');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError('User not found. Please check the username and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">GitHub User Search</h1>

      <div className="flex flex-col sm:flex-row w-full max-w-md gap-2 mb-8">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter GitHub username"
          className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}

      {user && !loading && (
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-100"
          />
          <h2 className="text-xl font-semibold text-gray-900">
            {user.name || user.login}
          </h2>
          <p className="text-gray-500 mb-3">@{user.login}</p>
          {user.bio && (
            <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
          )}
          <div className="flex justify-center gap-8 text-sm text-gray-700">
            <div>
              <span className="font-bold text-gray-900">{user.followers}</span> Followers
            </div>
            <div>
              <span className="font-bold text-gray-900">{user.following}</span> Following
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;