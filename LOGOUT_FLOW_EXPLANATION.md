# Logout Flow - Complete Implementation

## How Logout Works (ProfileScreen.tsx)

### 1. **User Clicks Logout Button**
- Button is located in ProfileScreen.tsx
- Calls `handleLogout()` function

### 2. **handleLogout() Function Flow**
```
handleLogout()
  ↓
  Alert.alert() - Confirmation dialog
  ↓
  User selects "Logout"
  ↓
  onPress callback executes:
    - Remove 'userToken' from AsyncStorage
    - Remove 'user' from AsyncStorage
    - Call setIsAuthenticated(false)
  ↓
  setIsAuthenticated(false) is passed down from App.tsx
```

### 3. **App.tsx State Change**
When `setIsAuthenticated(false)` is called:
- The state in App.tsx changes to `isAuthenticated = false`
- This triggers a re-render of the NavigationContainer
- The conditional navigation logic evaluates:

```tsx
{isAuthenticated ? (
  <AppNavigator />  // Shows if authenticated
) : (
  <AuthNavigator />  // Shows if NOT authenticated (after logout)
)}
```

### 4. **AuthNavigator** Takes Over
- AuthNavigator shows the **Login** screen
- User is now logged out and back at the login page

## Code Changes Made

### ProfileScreen.tsx handleLogout() - UPDATED ✅

**Location**: Line ~589

```tsx
const handleLogout = () => {
  console.log("Logout button pressed");

  Alert.alert('Logout', 'Are you sure you want to logout?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      style: 'destructive',
      onPress: async () => {
        try {
          console.log("Logout confirmed - removing tokens");
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('user');
          console.log("Tokens removed - calling setIsAuthenticated(false)");
          setIsAuthenticated(false);
          console.log("Logout complete - App.tsx should now show AuthNavigator");
        } catch (error) {
          console.error("Logout error:", error);
          Alert.alert('Error', 'Failed to logout');
        }
      },
    },
  ]);
};
```

## Testing the Logout

1. **In the app**, navigate to the Profile tab
2. **Click the "Logout" button** (red button at the bottom)
3. **Confirm logout** in the alert dialog
4. **Expected Result**: You should immediately see the Login screen
5. **Check console logs** for the flow:
   - "Logout button pressed"
   - "Logout confirmed - removing tokens"
   - "Tokens removed - calling setIsAuthenticated(false)"
   - "Logout complete - App.tsx should now show AuthNavigator"

## Why It Works

The logout functionality relies on the **App.tsx** component's conditional rendering:

```tsx
// App.tsx
return (
  <NavigationContainer>
    {isAuthenticated ? (
      <AppNavigator key="app-navigator" setIsAuthenticated={setIsAuthenticated} />
    ) : (
      <AuthNavigator
        key="auth-navigator"
        setIsAuthenticated={setIsAuthenticated}
        setUserToken={setUserToken}
      />
    )}
  </NavigationContainer>
);
```

When `setIsAuthenticated(false)` is called:
1. ✅ AsyncStorage is cleared (tokens removed)
2. ✅ State is updated to `isAuthenticated = false`
3. ✅ App.tsx re-renders with `isAuthenticated = false`
4. ✅ AuthNavigator is displayed
5. ✅ Login screen appears automatically

**No manual navigation needed** - the authentication state change automatically switches the entire navigation stack.
