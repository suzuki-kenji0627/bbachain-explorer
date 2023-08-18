import { ContactInfo } from "@solana/web3.js";

export default function getUniqueNodeVersionsPercentages(
  nodes: ContactInfo[]
): [string, number][] {
  const uniqueVersions = getUniqueNodeVersions(nodes);
  const totalNodes = nodes.length;
  const versionCounts = new Map<string, number>();
  nodes.forEach((node) => {
    const version = node.version;
    versionCounts.set(version, (versionCounts.get(version) || 0) + 1);
  });
  const versionPercentages = new Map<string, number>();
  uniqueVersions.forEach((version) => {
    const count = versionCounts.get(version) || 0;
    const percentage = (count / totalNodes) * 100;
    versionPercentages.set(version, percentage);
  });
  const versionPercentagesArray = Array.from(versionPercentages);
  return versionPercentagesArray;
}

function getUniqueNodeVersions(nodes: ContactInfo[]): string[] {
  const versions = nodes.map((node) => node.version);
  const uniqueVersions = [...new Set(versions)];
  return uniqueVersions;
}
