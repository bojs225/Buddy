mutation {
    signUp(input: {
      username: "kely2",
      name: "Kilo",
      password: "123",
      gender: "male"
    }) {
      id
      username
      name
      profilePicture
      gender
    }
  }

  mutation {
    login(input: { username: "kely2", password: "123" }) {
      id
      username
      name
      profilePicture
      gender
    }
  }
  
  query {
    me {
      id
      username
      name
      profilePicture
      gender
    }
  }
  