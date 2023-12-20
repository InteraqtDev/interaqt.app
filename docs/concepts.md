# Concepts

## 1. Quick Understanding

![](../static/img/concepts-1.png)

This diagram encapsulates the core concepts of Interaqt. Interaqt perceives the current state of a system as a computational result of the initial state combined with intermediate interactive events, or as a result based on other current states. Traditionally, programming approaches have focused on writing code for specific interactive events to modify data. Interaqt, however, requires only the "definition" of data. How data should change in response to certain interactions happens automatically.

For instance, in a multi-person approval system, approval is granted only when all parties agree. In traditional programming:

The relationship between the reviewer and the approval request is established during the "add reviewer" interaction.
The response code for the "approve" interaction calculates the approval result.

```javascript
async function addReviewer(currentUser, request) {
    // Pre-check conditions, for example:
    //  - Whether the relationship has already been added
    //  - Whether the request has been completed
    //  ...
    await SOME_ORM.create('review_relation', 
      { user: currentUser, request: request}
    )
}

async function ApproveCallback(currentUser, request) {
      // Pre-check conditions, for example:
      //  - Whether the relationship has already been added
      //  ...
    const currentReviewRelation = await SOME_ORM.updateOne('review_relation', 
      { user: currentUser, approved:true,  request: request}
    )
    const allReviewRelations = await SOME_ORM.find('review_relation', 
      { request: request}
    )
  
    if (allReviewRelations.every( relation => relation.approved)) {
        await SOME_ORM.updateOne('request', 
          { id: request.id, approved: true}
        )
    }
}
```

Programmer might store a total count of current review relations and approved counts in the Request for performance optimization. This way, they only need to compare these two fields for equality upon each review relation change, avoiding querying all review relations every time.

In contrast, Interaqt automatically provides all these capabilities, including pre-checks and "incremental comparison" for better performance, simply by defining the data:
```javascript
// computation based on  interaction 
ReviewRelation.comptuedData = MapInteraction.create({
  items: [
    MapInteractionItem.create({
      interaction: AddReviewerRelation,
      map: function map(event) {
        return { source: event.payload.request, target: event.user}
      }
    })
  ]
})

ReviewRelationApprovedProp.computedData = MapInteraction.create({
    relation: ApproveInteraction,
    match: (_, relation) => true
})

// computation based on other states
RequestApprovedProp.computedData = RelationBasedEvery.create({
    relation: ReviewRelation,
    match: (_, relation) => {
        return relation.approved
    }
})
```


## 2. Why Interaqt's Approach is Better

There's nothing new under the sun. You may have encountered similar approaches in various contexts, such as:

Reactive programming
Functional programming
Event-driven programming
Even the emphasis on "what is being expressed" over "how it's done" in programming education aligns with this philosophy.
Interaqt has made key advancements by incorporating the concept of "what is being expressed" into application frameworks. Its most important features include:

Using a cross-disciplinary approach from cognitive science, Interaqt ensures strong expressive capability, covering all user needs in targeted scenarios.
Interaqt addresses the performance issues common in traditional reactive programming through "automatic incremental implementation."
Revisiting traditional data manipulation methods with Interaqt, it becomes evident that most coding is "manual incremental programming," which is essential for meeting performance requirements in most scenarios.

With a complete ability to express "what is," automatic implementation, and scaling and migration aligned with user and data sizes become possible. Traditionally, these development tasks required substantial investment, ranging from millions to billions in research funds. With Interaqt, these can be automated. In the era of large models, the focus should be on using "language-based reasoning" to understand human needs, not on traditional code generation. The transition from "what is" to "how to do" should be as accurate as a mathematical axiom, not probabilistically correct, to eliminate the need for programmers and achieve full automation.

Explore how Interaqt integrates with ChatGPT to produce practical systems.     

[Use With ChatGPT](./tutorial/use-with-gpt)


## 3. Interaqt is NOT a "Silver Bullet"

Suitable scenarios: Applications with common multi-entity relationships and data concepts.

Limited utility: Scenarios with simple data, where complexity lies mainly in data editing (frontend).

Not suitable: System software like operating systems, databases, etc.
