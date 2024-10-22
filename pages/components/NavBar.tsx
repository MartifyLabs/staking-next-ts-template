import SvgMesh from "./SvgMesh";

export default function Navbar() {
  return (
    <nav className="fixed z-30 w-full border-b border-gray-200 bg-white/80 px-4 py-2.5 backdrop-blur lg:px-6">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
        <div className="flex items-center">
          <SvgMesh className="mr-3 h-6 sm:h-9" fill={"#000000"} />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            Mesh
          </span>
        </div>
      </div>
    </nav>
  );
}
