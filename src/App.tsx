import "@blocknote/core/fonts/inter.css";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  locales,
  PartialBlock,
} from "@blocknote/core";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";

const insertHelloWorldItem = (
  editor: BlockNoteEditor,
  setOpen: (arg: boolean) => void
) => ({
  title: "Insert Hello World",
  onItemClick: () => {
    setOpen(true);
  },
  aliases: ["h", "u", "y", "hu", "uy", "huy"],
  group: "Other",
  icon: (
    <span role="img" aria-label="Hello World">
      👋
    </span>
  ),
  subtext: "Used to insert a block with 'Hello World' below.",
});

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor,
  setOpen: (arg: boolean) => void
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertHelloWorldItem(editor, setOpen),
];

export default function App() {
  const [open, setOpen] = useState(false);
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      //first pass all the blockspecs from the built in, default block schema
      ...defaultBlockSpecs,

      // disable blocks you don't want
      audio: undefined as any,
      image: undefined as any,
      video: undefined as any,
      file: undefined as any,
      checkListItem: undefined as any,
    },
  });

  // Creates a new editor instance with the schema
  const editor = useCreateBlockNote({
    schema,
    dictionary: locales.ru,
  });

  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseMarkdownToBlocks(
        JSON.parse(
          '"# H1\\n\\nhuy\\n\\n*   Hello\\n\\n*   sad\\n\\n*   asd\\n\\n    *   asd\\n\\n        *   sadsad\\n\\n            *   asdsad\\n\\n1.  asd\\n\\n2.  asdsda\\n\\n3.  asd1\\n\\n    1.  asd2\\n\\n        1.  asd3\\n\\n            1.  asd3.1\\n\\n                1.  asd3.1.1\\n                2.  asd3.1.2\\n\\nHello"'
        )
      );
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor]);

  const setData = (cur, emoji) => {
    console.log("cur : --->", cur);
    const data = {
      ...cur,
      content: [
        {
          type: "text",
          text: `${cur.content[0].text} ${emoji.emoji}`,
          styles: {},
        },
      ],
    };
    console.log("data : --->", data);
    return data;
  };
  return (
    <div style={{ width: "100vw" }}>
      <button onClick={() => editor.openSelectionMenu("/")}>Open Menu</button>
      <button onClick={() => setOpen(true)}>Смайлики хуялики</button>

      <BlockNoteView className="max-h-20" editor={editor}>
        {open && (
          <EmojiPicker
            onEmojiClick={(emoji) => {
              const currentBlock = editor.getTextCursorPosition().block;
              console.log(
                "editor.getTextCursorPosition() : --->",
                editor.getTextCursorPosition()
              );
              console.log("currentBlock : --->", currentBlock);
              // New block we want to insert.
              const helloWorldBlock: PartialBlock = {
                type: "paragraph",
                content: [{ type: "text", text: emoji.emoji, styles: {} }],
              };
              editor.updateBlock(currentBlock, setData(currentBlock, emoji));
              // editor.insertBlocks([helloWorldBlock], currentBlock, "after");
              setOpen(false);
            }}
          />
        )}
      </BlockNoteView>
      <button
        onClick={async () => {
          const markdown = await editor.blocksToMarkdownLossy(editor.document);
          console.log(markdown);
        }}
      >
        Submit
      </button>
    </div>
  );
}
