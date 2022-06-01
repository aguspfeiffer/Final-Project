public with sharing class ProjectDataService {
   
    //Obtiene los projects de un PM
    @AuraEnabled(cacheable = true)
    public static List<Project__c> getProjects (){
        return [SELECT Name, AmountOpp__c, Customer__c, EndProject__c, StartProject__c, Opportunity__c, QuantityTotalHours__c, PM__c, Status__c FROM Project__c WHERE Opportunity__r.PM__c =: Userinfo.getUserId()];
    }

    //Obtiene los projectLineItem de un project 
    @AuraEnabled(cacheable = true)
    public static Map<String, List<Object>> getRolesByProject (String projectId){
    List<ProjectLineItem__c> rolesByProject = [SELECT Id, Role__c, QuantityHours__c, Project__c, AssignedHours__c FROM ProjectLineItem__c WHERE Project__c =: projectId];

    Map<String, List<Object>> wraperProject = new Map<String, List<Object>>();
    wraperProject.put('projectLineItem', rolesByProject);

    List<String> ProjectRole = new List<String>();
    for(ProjectLineItem__c pr : rolesByProject){
        ProjectRole.add(pr.Role__c);
    } 

    //testeo ultimA HORA 
    for(String stRole : ProjectRole){
        List<User> userList = getUsersByRole( stRole );
        wraperProject.put( stRole, userList );
    }

    wraperProject.put('Roles', ProjectRole);
    return wraperProject;
}

    //Obtiene los usuarios de x Rol
    @AuraEnabled(cacheable = true)
    public static List<User> getUsersByRole (String role){
        return [SELECT Id, Name, UserRole.Name, RatePerHour__c FROM User WHERE UserRole.Name =: role];
    }

    //Obtiene los ProjectResourses de un usuario
    @AuraEnabled(cacheable = true)
    public static List<ProjectResource__c> getResoursesByUserId (String userId){
        return [SELECT Id, StartDateResource__c, EndDateResource__c, Resource__c FROM ProjectResource__c WHERE Resource__c =: userId];
    }

}

//IMPORTANTE
//[SELECT Name, AmountOpp__c, Customer__c, EndProject__c, StartProject__c, Opportunity__c FROM Project__c WHERE PMID__c =: Userinfo.getUserId()] La real