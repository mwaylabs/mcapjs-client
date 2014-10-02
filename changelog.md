# Changelog

## 0.0.16 - 2014-07-24
- update mCAP.PushNotification API

## 0.0.15 - 2014-07-24
- add unauthorized event if any response raises an 401 error
- add mCAP.PushNotification
- changed mCAP.push collection API

## 0.0.14 - 2014-07-22
- make sure backbone has jquery
- resolve the fetch of a push app when devices, tags, jobs and own fetch are resolved

## 0.0.13 - 2014-07-17
- Add constants for studio, file and folder

## 0.0.12 - 2014-07-17
- Update the push app model after uploading the apns provider certificate

## 0.0.11 - 2014-07-16
- Add component type
- get the component type with the Utils API: mCAP.Utils.getComponentType

## 0.0.10 - 2014-07-16
- URL Bugfix for collections

## 0.0.9 - 2014-07-15
- Add ApnsProvider object - used by mCAP.push
- Add mCAP.Component - implements a version number that gets increased on every save.
- Bugfix mCAP.model success callback wasn't called

## 0.0.8 - 2014-07-11
- add token to push device

## 0.0.7 - 2014-07-11
- is authenticated bugfix

## 0.0.6 - 2014-07-11
- add push module

## 0.0.5 - 2014-07-02
- add login and logout events

## 0.0.4 - 2014-06-27
- add mCAP.authentication.isAuthenticated
- add mCAP.Utils Object

## 0.0.3 - 2014-06-25
- update login api
- implement organization model
- implement organizations collection
- add organization model to authentication object

## 0.0.2 - 2014-06-24
- add dist

## 0.0.1 - 2014-06-24
- Authentication
- First Working Draft