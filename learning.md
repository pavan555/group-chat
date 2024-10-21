### app launch issue

If you have app = require("../app"), then just make sure at the bottom of app.js there is: module.exports = app that way when you require it in /bin/www, it actually grabs the code.

## Pipes vs Sockets

Both pipes and sockets handle byte streams, but they do it in different ways...

pipes only exist within a specific host, and they refer to buffering between virtual files, or connecting the output / input of processes within that host. There are no concepts of packets within pipes.
sockets packetize communication using IPv4 or IPv6; that communication can extend beyond localhost. Note that different endpoints of a socket can share the same IP address; however, they must listen on different TCP / UDP ports to do so.
Usage:

Use pipes:
when you want to read / write data as a file within a specific server. If you're using C, you read() and write() to a pipe.
when you want to connect the output of one process to the input of another process... see popen()
Use sockets to send data between different IPv4 / IPv6 endpoints. Very often, this happens between different hosts, but sockets could be used within the same host

## XFP

The X-Forwarded-Proto (XFP) header is a de-facto standard header for identifying the protocol (HTTP or HTTPS) that a client used to connect to your proxy or load balancer.

## What is Reactive Programming?

> Reactive programming to put it briefly reactive programming is learning to program completely around asynchronous data streams.
> 
> This can be a wacky shift for a lot of programmers since reactive programming has no concept of mutable State while imperative programming focuses on the order in which your computer does things.
> 
> Reactive programs only care about the order in which things need to happen.
>
> Imperative programs focus on the call stack, whereas reactive ones react to events. You could also say that they are written ignorant of the time and context in which they are run.
>
> DOM events like key press wait for a stream of user input data and then respond accordingly. Now imagine you had to write a program that waited for a user to begin typing in a box and when they finish typing format their text and return it sounds pretty complex.
>
> In reactive programming this is a few lines of code we generate an observable stream out of the user input we add a subscriber to the stream we buffer on a Time threshold so we know when the user finishes typing and then we change and return the text when we write reactively.
>
> Our code is more abstract and concise for highly interactive apps like modern single-page applications we don't have to worry so much about the data and instead can code a consistent and repeatable system.
>
> When your app needs to be quick to react to asynchronous behavior reactive programming is the way to go.

# Design

for now considering Only one admin he will access the APIs via internal token

1. Admin -> Initial User (should be created with a internal token) (API)

2. Users -> created/edited by only admin

   i. Create User API
   ii. Edit User Info API

3. Normal/Admin Users -> Login & Logout

   i. Login API (Admin will be authenticated via ADMIN token others will be via jwt cookie)
   ii. Logout API (Just removing the session created above)

Normal User API's

4.Groups - multiple groups can be there, each group can have any no of members

    i. Create Group - Done
    ii. Search Member - Done
    iii. Add members - Done
    iv. Remove members - Done
    v. Delete Group - Done
    vi. Update Group info - Done
    vii. Get groups for a user (created/member groups fetch only 10/50) -- Done

5. Group Messages -
   i. Send Message
   ii. Like Message
   iii. Delete Message
   iv. Get messages (last 50/whole messages)

## User Info :

```json
{
    name,
    emailId,
    createdAt,
    updatedAt,
    password
}
```

## Group Info :

```json
{
    groupName,
    groupDescription: optional,
    groupMembers: [emailIds],
    createdBy,
    createdAt,
    updatedAt
}
```

## Group Message :

```json
{
    groupId,
    message,
    likes: [emailIds],
    createdBy,
    createdAt,
    updatedAt
}
```
