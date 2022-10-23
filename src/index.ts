// Import modules
import axios from "axios";

// Load test data
import localData from "./data/records.json";

/**
 * Calculate the average balance of the records.
 *
 * Task: This seems pretty straightforward but could it be improved? Maybe
 * more declarative?
 *
 * @param localData array of objects
 * @returns number
 */
export function calculateAvgBalance(localData: Array<SampleDateRecord>): number {
  const total: number = localData.reduce((sum, item) => {
    return sum + Number((item.balance as string).replace(/[^0-9.-]+/g, ""));
  }, 0);

  return total / localData.length;
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops. The test is also failing for some reason 🤦.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  const tagCounts: { tag: string; count: number }[] = [];

  localData.forEach((item) => {
    item.tags.forEach((item2, index2) => {
      tagCounts.push({ tag: item2, count: index2 });
    });
  });

  return tagCounts;
}

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they
 * are all fetched at once then when they are done, return all the
 * titles? I also feel like something is missing here. Not
 * conforming to a standard maybe?
 *
 * @returns array of strings
 */
export async function returnSiteTitles(): Promise<string[]> {
  const titles: string[] = [];

  const URL1 = "https://www.startrek.com/";
  const URL2 = "https://bwfbadminton.com/";

  const promise1 = axios.get(URL1);
  const promise2 = axios.get(URL2);

  const values = await Promise.all([promise1, promise2]);
  let match;
  match = values[0].data.match(/<title>(.*?)<\/title>/);
  titles.push(match[1]);
  match = values[1].data.match(/<title>(.*?)<\/title>/);
  titles.push(match[1]);

  return titles;
}

/**
 * Reformat and validate some of the fields into proper types.
 *
 * Task: This seems a bit verbose. Add proper validation where
 * the comments suggest it. Feel free to modify anything
 * TypeScript-related if you need to 😉. External libraries
 * are fine to use. Could more native language features be
 * used to make it cleaner?
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function reformatData(localData: Array<SampleDateRecord>): Array<NewDateRecord> {
  const checkBalance = (quantity: string): number => {
    const quant: string = quantity.replace(/[^\d.]/g, "");
    return parseFloat(quant);
  };

  const isValidUrl = (urlString: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  const emailregexpre = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const isValidPhone = (value: string) => {
    if (!value) return null;
    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");
    return (
      phoneNumber.substring(0, 1) +
      "." +
      phoneNumber.substring(1, 4) +
      "." +
      phoneNumber.substring(4, 7) +
      "." +
      phoneNumber.substring(7)
    );
  };

  const parseISOLocal = (nonIso: any) => {
    const b = nonIso.split(/\D/);
    return new Date(b[0], b[1] - 1, b[2], b[3] || 0, b[4] || 0, b[5] || 0);
  };

  const reformattedData = localData.map((item) => {
    const container: NewDateRecord = {} as NewDateRecord;
    container._id = item._id;
    container.index = item.index;
    container.guid = item.guid;
    container.isActive = item.isActive;

    container.balance = checkBalance(item.balance);

    container.picture = isValidUrl(item.picture) ? item.picture : null;

    container.age = item.age;
    container.eyeColor = item.eyeColor;
    container.name = item.name;
    container.gender = item.gender;
    container.company = item.company;

    container.email = emailregexpre.test(item.email) ? item.email : null;

    container.phone = isValidPhone(item.phone);

    container.address = item.address;
    container.about = item.about;

    container.registered = parseISOLocal(item.registered).toISOString();
    container.latitude = item.latitude;
    container.longitude = item.longitude;
    container.tags = item.tags;
    container.friends = item.friends;

    return container;
  });

  return reformattedData;
}

/**
 * Build out a HTML <ul> list of names.
 *
 * Task: Can you make this more concise, less error-prone, and more declarative?
 *
 * @param localData array of objects
 * @returns string
 */
export function buildAList(localData: Array<SampleDateRecord>): string {
  let list = "<ul>" + "\r\n";
  localData.map((item) => {
    list += `<li>${item.name}</li>` + "\r\n";
  });

  list += "</ul>";
  return list;
}

/**
 * Filter the data by age with an optional limit.
 *
 * Task: The code looks a little smelly to me. Can you make it cleaner and
 * easier to follow? Bonus points for a more declarative approach.
 *
 * @param localData array of objects
 * @param age number
 * @param count number
 * @returns array of objects
 */
export function filterAgeGreaterThan(
  localData: Array<SampleDateRecord>,
  age: number,
  count = 0
): Array<SampleDateRecord> {
  const filteredData: Array<SampleDateRecord> = [];
  let counter = 0;
  localData.filter((agefilter) => {
    return agefilter.isActive && agefilter.age > age && counter++ < count ? filteredData.push(agefilter) : false;
  });

  return filteredData;
}

/**
 * A random function that does a number of things for Twilio Flex.
 *
 * Task: Don't worry about what this function is doing. There is no test
 * for this to pass. Rather, your task here is to simply try to improve on
 * the code that is here. Can you make it more concise and readable? Should
 * anything be added, abstracted, or removed?
 *
 * @param flex Flex object
 * @param manager manager object
 */
export function doALotOfStuff(flex: any, manager: any): void {
  /**
   * Variable to save the current worker
   */
  const currentWorker = manager.workerClient.sid;

  // Ignore this function.
  function displayContainer(value: string): void {
    console.log(value);
  }

  const invokeFlexAct = () => {
    displayContainer("none");

    flex.Actions.invokeAction(
      "HistoryPush",
      "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
    );
  };

  manager.insightsClient
    .liveQuery("tr-task", `data.worker_sid == "${currentWorker}"`)
    .then((args: Record<string, any>) => {
      const otherTask = new Map();
      const assignedTask = new Map();
      const items = args.getItems();
      Object.entries<any>(items).forEach(([key, value]) => {
        if (value.status === "assigned") {
          otherTask.delete(key);
          assignedTask.set(key, value);
        } else if (value.status === "wrapping") {
          assignedTask.set(key, value);
          otherTask.delete(key);
        } else {
          otherTask.set(key, value);
        }
      });

      if (assignedTask.size === 1 && otherTask.size === 0) {
        invokeFlexAct();
        // flex.Actions.invokeAction(
        //   "HistoryPush",
        //   "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
        // );
      } else {
        displayContainer("block");
      }

      manager.events.addListener("selectedViewChanged", (viewName: string) => {
        if (viewName === "agent-desktop" && assignedTask.size === 1 && otherTask.size === 0) {
          invokeFlexAct();
          // flex.Actions.invokeAction(
          //   "HistoryPush",
          //   "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
          // );
        }
      });

      args.on("itemUpdated", (args: any) => {
        if (args.value.status === "assigned") {
          otherTask.delete(args.key);
          assignedTask.set(args.key, args.value);
        } else if (args.value.status === "wrapping") {
          otherTask.delete(args.key);
        } else {
          otherTask.set(args.key, args.value);
        }

        if (assignedTask.size === 1 && otherTask.size === 0 && window.location.href.includes("agent-desktop")) {
          invokeFlexAct();
          // flex.Actions.invokeAction(
          //   "HistoryPush",
          //   "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
          // );
        } else {
          displayContainer("block");
        }
      });

      args.on("itemRemoved", (args: any) => {
        otherTask.delete(args.key);
        assignedTask.delete(args.key);
        if (assignedTask.size === 1 && otherTask.size === 0) {
          invokeFlexAct();
          // flex.Actions.invokeAction(
          //   "HistoryPush",
          //   "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
          // );
        } else {
          displayContainer("block");
        }
      });
    });
}

/* eslint-disable */
(async () => {
  console.log(
    calculateAvgBalance(localData),
    findTagCounts(localData),
    await returnSiteTitles(),
    reformatData(localData),
    buildAList(localData),
    filterAgeGreaterThan(localData, 39, 10)
  );
})();
