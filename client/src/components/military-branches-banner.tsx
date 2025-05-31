import { useQuery } from "@tanstack/react-query";
import { imageService } from "@/lib/imageService";

export default function MilitaryBranchesBanner() {
  const { data: militarySeals } = useQuery({
    queryKey: ["military-seals"],
    queryFn: () => imageService.searchImages("US military branch seal emblem official", 6),
  });

  const branches = [
    { name: "U.S. Army", established: "1775" },
    { name: "U.S. Navy", established: "1775" },
    { name: "U.S. Marine Corps", established: "1775" },
    { name: "U.S. Air Force", established: "1947" },
    { name: "U.S. Coast Guard", established: "1790" },
    { name: "U.S. Space Force", established: "2019" }
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
          {branches.map((branch, index) => {
            const sealImage = militarySeals && militarySeals[index % militarySeals.length];
            
            return (
              <div key={branch.name} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                  {sealImage ? (
                    <img
                      src={sealImage.urls.small}
                      alt={`${branch.name} official seal`}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {branch.name.split(' ').slice(1, 2).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {branch.name}
                </h4>
                <p className="text-xs text-gray-500">
                  Est. {branch.established}
                </p>
              </div>
            );
          })}
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