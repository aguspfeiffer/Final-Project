public with sharing class UserDataService {
  

    @AuraEnabled(cacheable = true)
            public static List<User> getUsersRole (String role){
                return [SELECT Id, Name, UserRole.Name, RatePerHour__c FROM User WHERE UserRole.Name =: role];
            }
             
        }