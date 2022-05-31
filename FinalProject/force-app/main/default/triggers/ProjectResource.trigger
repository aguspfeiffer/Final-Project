trigger ProjectResource on ProjectResource__c (before insert) {
    ProjectResourceTrigger.onBeforeInsert(Trigger.new);
}