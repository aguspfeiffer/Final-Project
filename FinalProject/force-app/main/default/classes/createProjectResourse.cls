public with sharing class createProjectResourse {  
    @AuraEnabled(cacheable=true)  
    public static List<ProjectLineItem__c> fetchUserList(String projectId){  
        return [SELECT Id, Role__c, QuantityHours__c, Project__c, AssignedHours__c FROM ProjectLineItem__c WHERE Project__c =: projectId];
    }  
    @AuraEnabled  
    public static void createRecord(List<ProjectResource__c> recList){  
      upsert recList;  
    }  
  }