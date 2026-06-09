function HostInfo({ host }) {
  return (
    <div className="flex items-center gap-4 border-b pb-6">
      <img
        src={host.image}
        alt={host.name}
        className="w-16 h-16 rounded-full"
      />

      <div>
        <h2 className="text-xl font-semibold">
          Hosted by {host.name}
        </h2>

        <p className="text-gray-600">
          {host.role} · {host.experience}
        </p>
      </div>
    </div>
  );
}

export default HostInfo;