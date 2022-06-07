import {navigate} from 'gatsby'

export default function handleAction(serv){
    console.log(serv.program_type)
    switch (serv.program_type) {
        case "WEB":
            navigate(`${serv.url}${serv.workflow_id}/${serv.program_id}`);
            break;
        case "PROCEDURE":
            console.log(serv.workflow_id)
            navigate(`/app/workflow/procedure/${serv.workflow_id}/${serv.program_id}/${serv.task_id}`);
            break;
        default:
            break;
    }
}