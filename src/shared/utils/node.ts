import os from 'os';
import cp from 'child_process';

export const getComputerName = () => {
  switch (process.platform) {
    case 'win32':
      return process.env.COMPUTERNAME;
    case 'darwin':
      return cp.execSync('scutil --get ComputerName').toString().trim();
    case 'linux':
      const prettyname = cp.execSync('hostnamectl --pretty').toString().trim();
      return prettyname === '' ? os.hostname() : prettyname;
    default:
      return os.hostname();
  }
};
