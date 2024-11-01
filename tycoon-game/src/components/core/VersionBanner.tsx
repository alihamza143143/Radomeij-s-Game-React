import React from "react";

interface VersionBannerProps {
  version: string;
}

const VersionBanner: React.FC<VersionBannerProps> = ({ version }) => {
  return (
    <div className="fixed -bottom-2 right-2 textarea-xs text-black bg-transparent opacity-40 z-[900] pointer-events-none ">
      Version {version}
    </div>
  );
};

export default VersionBanner;
