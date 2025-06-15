import { useBranch } from "@/contexts/BranchContext";
import { Link } from "wouter";
import armyImage from "@assets/U.S Army.png";
import navyImage from "@assets/U.S Navy.png";
import marineImage from "@assets/U.S Marine Corps.png";
import airforceImage from "@assets/U.S Airforce.png";
import coastguardImage from "@assets/U.S Coast Guard.jpg";
import spaceforceImage from "@assets/U.S Space Force.png";

export default function MilitaryBranchesBanner() {
  const { selectedBranch, setBranch } = useBranch();
  
  const branches = [
    { 
      name: "U.S. Army", 
      established: "1775", 
      image: armyImage, 
      branchId: "army",
      route: "/attorneys?branch=army"
    },
    { 
      name: "U.S. Navy", 
      established: "1775", 
      image: navyImage, 
      branchId: "navy",
      route: "/attorneys?branch=navy"
    },
    { 
      name: "U.S. Marine Corps", 
      established: "1775", 
      image: marineImage, 
      branchId: "marines",
      route: "/attorneys?branch=marines"
    },
    { 
      name: "U.S. Air Force", 
      established: "1947", 
      image: airforceImage, 
      branchId: "airforce",
      route: "/attorneys?branch=airforce"
    },
    { 
      name: "U.S. Coast Guard", 
      established: "1790", 
      image: coastguardImage, 
      branchId: "coastguard",
      route: "/attorneys?branch=coastguard"
    },
    { 
      name: "U.S. Space Force", 
      established: "2019", 
      image: spaceforceImage, 
      branchId: "spaceforce",
      route: "/attorneys?branch=spaceforce"
    }
  ];

  return (
    <section className="bg-gray-50 py-8 sm:py-12 border-t border-gray-200 w-full max-w-full overflow-hidden mobile-section no-scroll-x">
      <div className="w-full max-w-full mx-auto mobile-form-container">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 px-1 sm:px-2 responsive-text text-overflow-safe">
            Serving All Branches of the U.S. Military
          </h3>
          <p className="text-sm sm:text-base text-gray-600 px-1 sm:px-2 responsive-text text-overflow-safe">
            Dedicated legal support for every service member, across all branches of our armed forces
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6 items-center justify-items-center w-full max-w-full no-scroll-x">
          {branches.map((branch) => (
            <Link key={branch.name} href={branch.route}>
              <button 
                className={`text-center group w-full max-w-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 rounded-lg p-1 sm:p-3 md:p-4 mobile-card ${
                  selectedBranch === branch.branchId ? 'bg-navy-50 ring-2 ring-navy-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => setBranch(branch.branchId)}
                aria-label={`View ${branch.name} legal resources and attorneys`}
              >
                <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-1 sm:mb-3 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow flex-shrink-0">
                  <img
                    src={branch.image}
                    alt={`${branch.name} emblem`}
                    className="w-full h-full object-cover responsive-image"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 leading-tight responsive-text text-overflow-safe">
                  {branch.name}
                </h4>
                <p className="text-xs text-gray-600 responsive-text text-overflow-safe">
                  Est. {branch.established}
                </p>
              </button>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600 responsive-text text-overflow-safe px-1 sm:px-2">
            Honoring the service and sacrifice of all who serve our nation
          </p>
        </div>
      </div>
    </section>
  );
}