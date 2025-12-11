import { Link } from "react-router"; 
import TeamPhoto1 from "../assets/team_member_1.png";
import TeamPhoto2 from "../assets/team_member_2.png";
import TeamPhoto3 from "../assets/team_member_3.png";

export function Team() {
  const teamMembers = [
    { name: "Johannes", photo: TeamPhoto1, Nim: "241401001" },
    { name: "Nazwa", photo: TeamPhoto2, Nim: "241401106" },
    { name: "Haqi", photo: TeamPhoto3, Nim: "241401109" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
         <div className="bg-green-500 rounded-lg p-6 mb-6">
          <div>
        <h1 className="judul-team">Tentang ReCycle Market</h1>
        </div>
        <p className="text-black text-sm leading-relaxed">
          Recycle Market adalah sebuah Website yang menyediakan layanan dalam memberikan informasi tentang
          produk barang bekas yang dijual, dimana setiap produk dilengkapi dengan informasi detail,
          termasuk nama, deskripsi, foto, lokasi, dan harga yang lebih transparan, harga jualannya sehingga dapat
          membantu mengurangi kesulitan dalam mencari barang bekas berkualitas oleh pengguna, Website ini juga
          memiliki fitur untuk penjual untuk ingin memposting barang jualannya sehingga dapat dilihat oleh
          pembeli untuk mencari barang yang ingin mereka beli.
        </p>
      </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-4xl text-gray-900 mb-4">Meet the Team: Team Yareuuu</h2>
          <p className="text-gray-600">Projek ini dibuat oleh Team Yareuuu - Website Recycle Market.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center border border-gray-200">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-green-600">
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h3 className="text-gray-900 font-semibold">{member.name}</h3>
                <p className="text-green-600 text-sm">{member.Nim}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}