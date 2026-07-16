export interface JobApplicationDeniedEvent {
    key:string
    deniedById:string
    jobAppId:string
    name:string
    email:string
    jobId:string
    role:string
    message:string
}