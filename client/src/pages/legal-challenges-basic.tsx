export default function LegalChallenges() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
        Legal Preparedness Challenges
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Sharpen your military legal knowledge through interactive challenges and earn achievement badges
      </p>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Available Challenges</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>6</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Categories</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>4</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Difficulty Levels</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎖️</span>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Achievement Badges</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Achievement Badges</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Legal Scholar</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Complete 5 challenges</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>UCMJ Expert</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Master military law challenges</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Perfect Score</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Score 100% on a challenge</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Speed Runner</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Finish in under 10 minutes</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏛️</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Court-Martial Master</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Complete court-martial challenges</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎖️</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Benefits Navigator</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Complete VA benefits challenges</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌟</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Multi-Branch Expert</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Complete all branch challenges</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👑</div>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Legal Champion</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Achieve 85%+ on all challenges</p>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Legal Challenges</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          
          {/* Challenge 1 */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🛡️</span>
                  UCMJ Article 86 - Absence Without Leave
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#10b981', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>beginner</span>
                  <span style={{ border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Army</span>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Master the fundamentals of unauthorized absence under military law, including defenses and consequences.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>⏱️ 15 min</span>
                <span>⭐ 100 points</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span>Passing Score: 70%</span>
                <span>2 Questions</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>UCMJ</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Article 86</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Military Law</span>
              </div>
              <button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                Start Challenge
              </button>
            </div>
          </div>

          {/* Challenge 2 */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎯</span>
                  Court-Martial Procedures and Rights
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>intermediate</span>
                  <span style={{ border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Navy</span>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Navigate the complexities of military court proceedings, from charges to appeals.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>⏱️ 25 min</span>
                <span>⭐ 150 points</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span>Passing Score: 75%</span>
                <span>2 Questions</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Court-Martial</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Legal Rights</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Procedures</span>
              </div>
              <button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                Start Challenge
              </button>
            </div>
          </div>

          {/* Challenge 3 */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📚</span>
                  Administrative Separations
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>intermediate</span>
                  <span style={{ border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Air Force</span>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Understand the process and implications of administrative discharge from military service.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>⏱️ 20 min</span>
                <span>⭐ 125 points</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span>Passing Score: 75%</span>
                <span>1 Question</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Discharge</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Administrative</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Separation</span>
              </div>
              <button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                Start Challenge
              </button>
            </div>
          </div>

          {/* Challenge 4 */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎖️</span>
                  VA Disability Claims Process
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>advanced</span>
                  <span style={{ border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>All Branches</span>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Master the intricacies of filing and appealing VA disability compensation claims.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>⏱️ 30 min</span>
                <span>⭐ 200 points</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span>Passing Score: 80%</span>
                <span>1 Question</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>VA</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Disability</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Benefits</span>
              </div>
              <button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                Start Challenge
              </button>
            </div>
          </div>

          {/* Challenge 5 */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🛡️</span>
                  Military Sexual Assault Response
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>advanced</span>
                  <span style={{ border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Marines</span>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Navigate reporting options, legal procedures, and support resources for military sexual assault cases.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>⏱️ 35 min</span>
                <span>⭐ 250 points</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span>Passing Score: 85%</span>
                <span>1 Question</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Sexual Assault</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>SHARP</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>+2 more</span>
              </div>
              <button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                Start Challenge
              </button>
            </div>
          </div>

          {/* Challenge 6 */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📚</span>
                  Security Clearance Investigations
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>intermediate</span>
                  <span style={{ border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Space Force</span>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Understand the security clearance process, requirements, and potential issues that may arise.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>⏱️ 20 min</span>
                <span>⭐ 150 points</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span>Passing Score: 75%</span>
                <span>1 Question</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Security Clearance</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Investigation</span>
                <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>+2 more</span>
              </div>
              <button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
                Start Challenge
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}