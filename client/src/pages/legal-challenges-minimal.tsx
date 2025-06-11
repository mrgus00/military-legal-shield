export default function LegalChallenges() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Legal Preparedness Challenges
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sharpen your military legal knowledge through interactive challenges and earn achievement badges
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 text-yellow-500">🏆</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available Challenges</p>
              <p className="text-2xl font-bold">6</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 text-blue-500">🛡️</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 text-green-500">🎯</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty Levels</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 text-purple-500">🎖️</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Achievement Badges</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold text-sm mb-1">Legal Scholar</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Complete 5 challenges</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">⚖️</div>
            <h3 className="font-semibold text-sm mb-1">UCMJ Expert</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Master all military law challenges</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-sm mb-1">Perfect Score</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Score 100% on a challenge</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-sm mb-1">Speed Runner</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Finish in under 10 minutes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">🏛️</div>
            <h3 className="font-semibold text-sm mb-1">Court-Martial Master</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Complete court-martial challenges</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">🎖️</div>
            <h3 className="font-semibold text-sm mb-1">Benefits Navigator</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Complete VA benefits challenges</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">🌟</div>
            <h3 className="font-semibold text-sm mb-1">Multi-Branch Expert</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Complete all branch challenges</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center opacity-60">
            <div className="text-3xl mb-2">👑</div>
            <h3 className="font-semibold text-sm mb-1">Legal Champion</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Achieve 85%+ on all challenges</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800">
            <option>All Categories</option>
            <option>Military Law</option>
            <option>Court Martial</option>
            <option>Administrative</option>
            <option>Benefits</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Military Branch</label>
          <select className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800">
            <option>All Branches</option>
            <option>Army</option>
            <option>Navy</option>
            <option>Air Force</option>
            <option>Marines</option>
            <option>Coast Guard</option>
            <option>Space Force</option>
          </select>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Challenge 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>🛡️</span>
                UCMJ Article 86 - Absence Without Leave
              </h3>
              <div className="flex gap-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">beginner</span>
                <span className="border px-2 py-1 rounded text-xs">Army</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Master the fundamentals of unauthorized absence under military law, including defenses and consequences.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ 15 min</span>
                <span>⭐ 100 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Passing Score: 70%</span>
                <span>2 Questions</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">UCMJ</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Article 86</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Military Law</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Start Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Challenge 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>🎯</span>
                Court-Martial Procedures and Rights
              </h3>
              <div className="flex gap-2">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">intermediate</span>
                <span className="border px-2 py-1 rounded text-xs">Navy</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Navigate the complexities of military court proceedings, from charges to appeals.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ 25 min</span>
                <span>⭐ 150 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Passing Score: 75%</span>
                <span>2 Questions</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Court-Martial</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Legal Rights</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Procedures</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Start Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Challenge 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>📚</span>
                Administrative Separations
              </h3>
              <div className="flex gap-2">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">intermediate</span>
                <span className="border px-2 py-1 rounded text-xs">Air Force</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Understand the process and implications of administrative discharge from military service.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ 20 min</span>
                <span>⭐ 125 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Passing Score: 75%</span>
                <span>1 Question</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Discharge</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Administrative</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Separation</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Start Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Challenge 4 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>🎖️</span>
                VA Disability Claims Process
              </h3>
              <div className="flex gap-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">advanced</span>
                <span className="border px-2 py-1 rounded text-xs">All Branches</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Master the intricacies of filing and appealing VA disability compensation claims.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ 30 min</span>
                <span>⭐ 200 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Passing Score: 80%</span>
                <span>1 Question</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">VA</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Disability</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Benefits</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Start Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Challenge 5 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>🛡️</span>
                Military Sexual Assault Response
              </h3>
              <div className="flex gap-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">advanced</span>
                <span className="border px-2 py-1 rounded text-xs">Marines</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Navigate reporting options, legal procedures, and support resources for military sexual assault cases.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ 35 min</span>
                <span>⭐ 250 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Passing Score: 85%</span>
                <span>1 Question</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Sexual Assault</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">SHARP</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">+2 more</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Start Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Challenge 6 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>📚</span>
                Security Clearance Investigations
              </h3>
              <div className="flex gap-2">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">intermediate</span>
                <span className="border px-2 py-1 rounded text-xs">Space Force</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Understand the security clearance process, requirements, and potential issues that may arise.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ 20 min</span>
                <span>⭐ 150 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Passing Score: 75%</span>
                <span>1 Question</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Security Clearance</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Investigation</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">+2 more</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}