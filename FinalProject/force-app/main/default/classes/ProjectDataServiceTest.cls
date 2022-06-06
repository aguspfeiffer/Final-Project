@isTest
public with sharing class ProjectDataServiceTest {

    private static List<String> roles = new List<String>{'Architect', 'Developer', 'Consultant'};

    private static Opportunity newOpp (Id pm, Integer i){
        Opportunity newOpp = new Opportunity (
            Name= 'Opp Test' + i,
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
            Amount__c = 5000
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

    private static TaskProject__c newTask (Id PR, Integer i){
        TaskProject__c task = new TaskProject__c(
            Name = '',
            Description__c = 'Task ' + i,
            Status__c = 'Not Started',
            StartTask__c = System.today(),
            EndTask__c = System.today().addDays(30),
            ProjectResource__c = PR
        );
        return task;
    }

    @isTest
    private static void testProjectDataService(){
        //SET UP
        List<User> developerList =[SELECT Id, Name, UserRole.Name FROM USER WHERE UserRole.Name = 'Developer'];

        List<User> consultantList =[SELECT Id, Name, UserRole.Name FROM USER WHERE UserRole.Name = 'Consultant'];

        List<User> architectList =[SELECT Id, Name, UserRole.Name FROM USER WHERE UserRole.Name = 'Architect'];

        User pm = [SELECT Id, Name FROM User WHERE UserRole.Name = 'Project Manager' LIMIT 1];

        List<Opportunity> oppList = new List<Opportunity>(); 


        for(Integer i=0; i<2; i++){
            oppList.add(newOpp(pm.Id, i));
        }

        insert oppList;

      
        List<OpportunityLineItem__c> oppLineItemList = new List<OpportunityLineItem__c>();
        
        for(Opportunity opp :oppList){
            for(String rol :roles){
                oppLineItemList.add(newOppLineItem(opp.Id, rol));
            }
            opp.StageName = 'Closed Won';
        }
        insert oppLineItemList;

        update oppList;

        List<Project__c> projects = [SELECT Id, Name FROM Project__c];

        System.assertEquals(3, ProjectDataService.getRolesByProject(projects[0].Id).size());

        List<ProjectLineItem__c> PLIList = [SELECT Id, Project__c, Role__c FROM ProjectLineItem__c WHERE Project__c =: projects[0].Id];

        List<ProjectResource__c> PRList = new List<ProjectResource__c>();

        for(ProjectLineItem__c p :PLIList){
            if(p.Role__c == 'Developer'){
                PRList.add(newPR(p.Id,  System.today(), System.today().addDays(5), developerList[0].Id));
            } else if(p.Role__c == 'Consultant'){
                PRList.add(newPR(p.Id,  System.today(), System.today().addDays(5), consultantList[0].Id));
            } else {
                PRList.add(newPR(p.Id,  System.today(), System.today().addDays(5), architectList[0].Id));
            }
        }

        ProjectResource__c PR1 = newPR(PLIList[0].Id, System.today().addDays(6), System.today().addDays(15), developerList[0].Id);

        User userlog = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId() ];

        ProjectResource__c userLogPR = newPR(PLIList[0].Id, System.today().addDays(6), System.today().addDays(15), userlog.Id);

        insert PRList;

        insert PR1;

        insert userLogPR;

        system.assertEquals(1, ProjectDataService.getUsersByRole('Developer', projects[1].Id).size());
        system.assertEquals(2,ProjectDataService.getUsersByRole('Developer', projects[0].Id).size());

        system.assertEquals(5, ProjectDataService.getProjectResource(projects[0].Id).size());

        projects[0].SquadLead__c = 'Agustin Pfeiffer';
        update projects[0];
        
        List<TaskProject__c> taskList = new List<TaskProject__c>();
        for(Integer i = 0; i<5; i++){
            taskList.add(newTask(userLogPR.Id, i));
        }
        
        projects[0].Status__c = 'In Progress';
        update projects[0];

        insert taskList;

        system.assertEquals(5, ProjectDataService.getTaskByUser().size());

    }
}