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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 items-center justify-items-center w-full max-w-full no-scroll-x">
          {branches.map((branch) => (
            <Link key={branch.name} href={branch.route}>
              <button 
                className={`text-center group w-full max-w-full transition-all duration-300 hover:scale-110 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 rounded-xl p-3 sm:p-4 md:p-6 mobile-card shadow-lg hover:shadow-2xl ${
                  selectedBranch === branch.branchId 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-100 ring-4 ring-blue-400 shadow-xl' 
                    : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                }`}
                onClick={() => setBranch(branch.branchId)}
                aria-label={`View ${branch.name} legal resources and attorneys`}
              >
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md border-2 border-gray-200 flex items-center justify-center overflow-hidden group-hover:shadow-xl group-hover:border-blue-300 transition-all duration-300 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-indigo-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={branch.image}
                    alt={`${branch.name} emblem`}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                  <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-blue-300 rounded-xl transition-all duration-300"></div>
                </div>
                <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-900 transition-colors duration-300">
                  {branch.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 group-hover:text-blue-700 transition-colors duration-300 font-medium">
                  Est. {branch.established}
                </p>
                <div className="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="inline-flex items-center text-xs text-blue-600 font-semibold">
                    <span>View Attorneys</span>
                    <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
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