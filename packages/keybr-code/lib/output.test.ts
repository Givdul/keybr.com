import { flattenStyledText } from "@keybr/textinput";
import test from "ava";
import { Output } from "./output.ts";

test("append", (t) => {
  const output = new Output(100);
  t.is(flattenStyledText(output.text), "");

  output.append("1");
  t.is(flattenStyledText(output.text), "1");

  output.separate(",");
  t.is(flattenStyledText(output.text), "1");

  output.append("2");
  t.is(flattenStyledText(output.text), "1,2");

  output.append("3");
  t.is(flattenStyledText(output.text), "1,23");

  output.separate("");
  output.append("4");
  t.is(flattenStyledText(output.text), "1,234");

  output.separate(";");
  output.append("");
  t.is(flattenStyledText(output.text), "1,234");

  output.append("5");
  t.is(flattenStyledText(output.text), "1,234;5");
});

test("separate", (t) => {
  const output = new Output(100);
  t.is(flattenStyledText(output.text), "");

  output.append(" ");
  t.is(flattenStyledText(output.text), "");

  output.append("1");
  t.is(flattenStyledText(output.text), "1");

  output.append(" ");
  t.is(flattenStyledText(output.text), "1");

  output.append("2");
  t.is(flattenStyledText(output.text), "1 2");
});

test("limits", (t) => {
  const output = new Output(3);
  t.is(output.length, 0);
  t.is(output.remaining, 3);
  t.is(flattenStyledText(output.text), "");

  output.append("1");
  t.is(output.length, 1);
  t.is(output.remaining, 2);
  t.is(flattenStyledText(output.text), "1");

  t.throws(
    () => {
      output.append("234");
    },
    { is: Output.Stop },
  );
  t.is(output.length, 1);
  t.is(output.remaining, 2);
  t.is(flattenStyledText(output.text), "1");

  t.throws(
    () => {
      output.separate(",,,");
    },
    { is: Output.Stop },
  );
  t.is(output.length, 1);
  t.is(output.remaining, 2);
  t.is(flattenStyledText(output.text), "1");

  output.separate(",");
  t.is(output.length, 2);
  t.is(output.remaining, 1);
  t.is(flattenStyledText(output.text), "1");

  t.throws(
    () => {
      output.append("23");
    },
    { is: Output.Stop },
  );
  t.is(output.length, 2);
  t.is(output.remaining, 1);
  t.is(flattenStyledText(output.text), "1");

  output.append("2");
  t.is(output.length, 3);
  t.is(output.remaining, 0);
  t.is(flattenStyledText(output.text), "1,2");

  output.clear();
  t.is(output.length, 0);
  t.is(output.remaining, 3);
  t.is(flattenStyledText(output.text), "");
});
