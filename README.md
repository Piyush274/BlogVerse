To Do :- 

1. Add after

  const handleSignOut = () => {
    signOut().then(() => {
      window.location.href = "/";
    });
  };

  return 
    <SignedIn>
      <UserButton />
      <button onClick={handleSignOut} className="text-sm text-red-500 ml-4">
        Sign Out
      </button>

2. Read more to that particular article
