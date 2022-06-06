@isTest
public with sharing class ProjectDataServiceTest {
    
    private static Opportunity newOpp (Id pm){
        Opportunity newOpp = new Opportunity (
            Name= 'Opp Test',
            CloseDate= System.today(),
            StartProject__c= System.today(),
            EndProject__c = System.today().addDays(30),
            PM__c= pm,
            StageName= 'Negotiation/Review'
        );
        return newOpp;
    }

    private static OpportunityLineItem__c newOppLineItem(Id oppId, String role){

        OpportunityLineItem__c oppLineItem = new OpportunityLineItem__c(
            Name = role,
            Opportunity__c = oppId,
            Role__c =role,
            QuantityHours__c = 24,
            Amount__c = 500
        );
        return oppLineItem;
    }

    private static ProjectResource__c newPR (Id PLiID, Date startDate ,Date endDate, Id resourceId){
        ProjectResource__c PR = new ProjectResource__c(
            Name = '',
            ProjectLineItem__c = PLiId,
            StartDateResource__c = startDate,
            EndDateResource__c = endDate,
            Resource__c = resourceId
            );
        return PR;
    }

    @isTest

    private static void testProjectDataService(){
        //SET UP
        List<User> userList =[SELECT Id, Name, UserRole.Name FROM USER WHERE UserRole.Name = 'Developer'];

        
    }
}