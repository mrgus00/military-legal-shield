import armyImage from "@assets/U.S Army.png";
import navyImage from "@assets/U.S Navy.png";
import marineImage from "@assets/U.S Marine Corps.png";
import airforceImage from "@assets/U.S Airforce.png";
import coastguardImage from "@assets/U.S Coast Guard.jpg";
import spaceforceImage from "@assets/U.S Space Force.png";

export default function MilitaryBranchesBanner() {
  const branches = [
    { name: "U.S. Army", established: "1775", image: armyImage },
    { name: "U.S. Navy", established: "1775", image: navyImage },
    { name: "U.S. Marine Corps", established: "1775", image: marineImage },
    { name: "U.S. Air Force", established: "1947", image: airforceImage },
    { name: "U.S. Coast Guard", established: "1790", image: coastguardImage },
    { name: "U.S. Space Force", established: "2019", image: spaceforceImage }
  ];

  return (
    <section className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Serving All Branches of the U.S. Military
          </h3>
          <p className="text-gray-600">
            Dedicated legal support for every service member, across all branches of our armed forces
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
          {branches.map((branch) => (
            <div key={branch.name} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                <img
                  src={branch.image}
                  alt={`${branch.name} military imagery`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {branch.name}
              </h4>
              <p className="text-xs text-gray-500">
                Est. {branch.established}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Honoring the service and sacrifice of all who serve our nation
          </p>
        </div>
      </div>
    </section>
  );
}