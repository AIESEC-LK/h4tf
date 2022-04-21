const { IncomingWebhook } = require('@slack/webhook');

const webhooks = {
  admin: "https://hooks.slack.com/services/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",
  uoc: "https://hooks.slack.com/services/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",
  uok: "https://hooks.slack.com/services/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",
  uom: "https://hooks.slack.com/services/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",
  usj: "https://hooks.slack.com/services/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",
  uop: "https://hooks.slack.com/services/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",
  sliit: "https://hooks.slack.com/services/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",
  ruhuna: "https://hooks.slack.com/services/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",
  nsbm: "https://hooks.slack.com/services/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"
}

module.exports = {
  sendNotifications: async function (payment, participant) {

    const adminWebhook = new IncomingWebhook(webhooks.admin);
    const entityWebhook = new IncomingWebhook(webhooks[participant.entity]);

    const data = {
      "text": `[H4TF] [${participant.entity.toUpperCase()}] Payment Update`,
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": `[H4TF] [${participant.entity.toUpperCase()}] Payment Update`
          }
        }
      ],
      "attachments": [
        {
          "color": "#019875",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `Name\t\t\t: <http://h4tf.aiesec.lk/participants/${participant.email}|${participant.first_name} ${participant.last_name}>`
              }
            }
          ]
        },
        {
          "color": "#019875",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `Amount\t\t: ${payment.amount}`
              }
            }
          ]
        },
        {
          "color": "#019875",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `Timestamp\t: ${payment.time}`
              }
            }
          ]
        },
      ]
    }

    await (async () => {
      await adminWebhook.send(data);
    })();

    await (async () => {
      await entityWebhook.send(data);
    })();


  }
}
