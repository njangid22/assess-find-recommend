
export interface AssessmentData {
  title: string;
  description: string;
  link: string;
}

export interface Assessment {
  id: string;
  name: string;
  type: string;
  url: string;
  duration: string;
  remote_support: string;
  adaptive: string;
}
