public with sharing class ProjectDataService {
   
    //Obtiene los projectLineItem de un proyecto 
    @AuraEnabled(cacheable = true)
    public static List<ProjectLineItem__c> getRolesByProject (String projectId){
        return [SELECT Id, Role__c, QuantityHours__c, Project__c, AssignedHours__c,Project__r.ActualTotalAmount__c, ActualTotalHours__c FROM ProjectLineItem__c WHERE Project__c =: projectId];
    }
    
    //Obtiene todos los Recursos asignados a un determinado proyecto
    @AuraEnabled(cacheable = true)
    public static List<Object> getProjectResource(String projectId){
        
        List<ProjectLineItem__c> PLI = [SELECT Id, Project__c FROM ProjectLineItem__c WHERE Project__c =: projectId];
        
        return [SELECT Name, StartDateResource__c, EndDateResource__c, ProjectLineItem__c FROM ProjectResource__c WHERE ProjectLineItem__c IN : PLI ];
    }

    //Obtiene los usuarios de 'x' Rol disponibles en las fechas del proyecto
    @AuraEnabled(cacheable = true)
    public static List<User> getUsersByRole (String role, String projectId){
        Boolean assign = true;
        //Buscamos en la DB el proyecto actual
        Project__c project =[SELECT Id, Name, StartProject__c, EndProject__c, ActualTotalAmount__c FROM Project__c WHERE Id =: projectId];
       
        Date startProject = project.StartProject__c;
        Date endProject = project.EndProject__c;
        
        //Buscamos en la DB todos los usuarios con un mismo rol disponibles para el proyecto
        List<User> usersListByRole =[SELECT Id, Name, UserRole.Name, RatePerHour__c, ( SELECT StartDateResource__c, EndDateResource__c, ProjectLineItem__r.Project__c FROM ProjectResources__r WHERE  (StartDateResource__c >=:startProject AND StartDateResource__c <=: endProject) OR (EndDateResource__c >=:startProject AND EndDateResource__c <=: endProject )) FROM User WHERE UserRole.Name =: role ];

        //Creamos una List para popular los usuarios disponibles para el proyecto
        List<User> availableUsers = new List<User>();
        //Filtramos los usuarios y populamos la lista
        for(User user : usersListByRole){
            if(user.ProjectResources__r.isEmpty()){
                availableUsers.add(user);
            } else {
                for(ProjectResource__c pr : user.ProjectResources__r){
                if(pr.ProjectLineItem__r.Project__c != project.Id){
                    assign = false;
                }
            }
            if(assign){
                availableUsers.add(user);
            }
            }
        }   
        return availableUsers;
    }  
    
    //Obtiene las tareas asignadas al Usuario logueado
    @AuraEnabled(cacheable = true)
    public static Map<String, List<TaskProject__c>> getTaskByUser (){
        List<TaskProject__c> tasksList = [SELECT Project_Name__c, InProgress__c, Name, Description__c, Status__c, EstimatedHours__c, RegisterHours__c, InsertHs__c, ProjectResource__r.Resource__c, Project__c, StartTask__c, EndTask__c FROM TaskProject__c WHERE OwnerId =: UserInfo.getUserId() AND Status__c != 'Completed' ORDER BY  StartTask__c, Status__c DESC];

        Map<String, List<TaskProject__c>> taskListByProjectMap = new Map<String, List<TaskProject__c>>();

        for(TaskProject__c tsk: tasksList){
            if(taskListByProjectMap.containsKey(tsk.Project_Name__c)){
                taskListByProjectMap.get(tsk.Project_Name__c).add(tsk);
            } else{
                taskListByProjectMap.put(tsk.Project_Name__c, new List<TaskProject__c>{tsk});
            }
        }

        return taskListByProjectMap;
    }
    
    //Crea en la DB la asignacion de los recursos provenientes del front
    @AuraEnabled
    public static void assignResource (List<ProjectResource__c> resourceToAssign){
     
        insert resourceToAssign;
    }
    
}