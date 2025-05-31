import { useQuery } from "@tanstack/react-query";
import { imageService } from "@/lib/imageService";

export default function MilitaryBranchesBanner() {
  const { data: armyImages } = useQuery({
    queryKey: ["army-images"],
    queryFn: () => imageService.searchImages("army soldier military uniform boots", 2),
  });

  const { data: navyImages } = useQuery({
    queryKey: ["navy-images"], 
    queryFn: () => imageService.searchImages("aircraft carrier navy ship military", 2),
  });

  const { data: marineImages } = useQuery({
    queryKey: ["marine-images"],
    queryFn: () => imageService.searchImages("marine soldier combat gear military", 2),
  });

  const { data: airforceImages } = useQuery({
    queryKey: ["airforce-images"],
    queryFn: () => imageService.searchImages("F22 raptor fighter jet military aircraft", 2),
  });

  const { data: coastguardImages } = useQuery({
    queryKey: ["coastguard-images"],
    queryFn: () => imageService.searchImages("coast guard boat ship rescue", 2),
  });

  const { data: spaceforceImages } = useQuery({
    queryKey: ["spaceforce-images"],
    queryFn: () => imageService.searchImages("space satellite rocket military space force", 2),
  });

  const branches = [
    { name: "U.S. Army", established: "1775", images: armyImages },
    { name: "U.S. Navy", established: "1775", images: navyImages },
    { name: "U.S. Marine Corps", established: "1775", images: marineImages },
    { name: "U.S. Air Force", established: "1947", images: airforceImages },
    { name: "U.S. Coast Guard", established: "1790", images: coastguardImages },
    { name: "U.S. Space Force", established: "2019", images: spaceforceImages }
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
          {branches.map((branch) => {
            const branchImage = branch.images && branch.images.length > 0 ? branch.images[0] : null;
            
            return (
              <div key={branch.name} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                  {branchImage ? (
                    <img
                      src={branchImage.urls.small}
                      alt={`${branch.name} military imagery`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy-800 flex items-center justify-center">
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