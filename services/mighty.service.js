const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.addMemberToMighty = async ({ email, firstName, lastName }) => {
  const response = await fetch(
    `https://api.mn.co/admin/v1/networks/${process.env.MN_NETWORK_ID}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MN_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        role: "contributor",
      }),
    }
  );

  const data = await response.json();

  return {
    ok: response.ok,
    data,
  };
};

exports.variantToPlanID = async ({ planID, customer_email  }) => {
  const response = await fetch(
    `https://api.mn.co/admin/v1/networks/${process.env.MN_NETWORK_ID}/plans/${planID }/invites?email=${customer_email}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MN_TOKEN}`,
        "Content-Type": "application/json",
      }
    }
  );

  const data = await response.json();

  return {
    ok: response.ok,
    data,
  };
};