import { Icons } from "@/components/icons";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { getArtistArtworks$ } from "@server/artist";
import { getArtistArtworkQueryOptions } from "@server/query-options";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
	buttonStyles,
	Card,
	Description,
	Heading,
	SearchField,
	Table,
} from "ui";
import { z } from "zod";

const artworkSearchParam = z.object({
	page: fallback(z.number().min(1), 1).default(1),
	limit: fallback(z.number().min(1).max(100), 10).default(10),
});

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/artworks",
)({
	validateSearch: zodValidator(artworkSearchParam),
	loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
	loader: async ({ context: { queryClient }, deps: { page, limit } }) => {
		queryClient.ensureQueryData(getArtistArtworkQueryOptions({ page, limit }));
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { limit, page } = Route.useSearch();
	const getArtistArtworks = useServerFn(getArtistArtworks$);

	const { data: artworks } = useSuspenseQueryDeferred({
		...getArtistArtworkQueryOptions({ page, limit }),
		queryFn: async () => {
			const res = await getArtistArtworks({ data: { page, limit } });

			return res;
		},
	});

	return (
		<div>
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<div>
					<Heading>Artworks</Heading>
					<Description>
						Manage and track all your artworks in one place
					</Description>
				</div>
				<Link className={buttonStyles({ shape: "circle", size: "small" })}>
					<Icons.ArtworkUpload />
					Upload Artwork
				</Link>
			</div>
			<div className="mt-8">
				<div className="flex justify-end">
					<SearchField aria-label="Search Artworks" className={"w-full"} />
				</div>
				<div className="mt-4">
					<Card>
						<Table aria-label="Artworks">
							<Table.Header>
								<Table.Column>Artwork ID</Table.Column>
								<Table.Column isRowHeader>Artwork Name</Table.Column>
								<Table.Column>Price</Table.Column>
								<Table.Column>Category</Table.Column>
								<Table.Column>Dimensions</Table.Column>
								<Table.Column>Weight</Table.Column>
								<Table.Column>Stock</Table.Column>
								<Table.Column>Condition</Table.Column>
								<Table.Column>Actions</Table.Column>
							</Table.Header>
							<Table.Body
								items={artworks.artworks}
								renderEmptyState={() => (
									<div className="flex flex-col items-center justify-center p-4">
										<p className="text-fg text-base mb-1 font-semibold">
											No artworks found
										</p>
										<p className="text-muted-fg text-sm">
											You haven't uploaded any artworks yet. Start by adding
											your first artwork.
										</p>
										<Link
											className={buttonStyles({
												size: "extra-small",
												className: "mt-4",
												shape: "circle",
											})}
										>
											<Icons.ArtworkUpload />
											Upload Artwork
										</Link>
									</div>
								)}
							>
								{(items) => (
									<Table.Row id={items.id}>
										<Table.Cell>{items.id}</Table.Cell>
										<Table.Cell>{items.title}</Table.Cell>
										<Table.Cell>{items.price}</Table.Cell>
										<Table.Cell>{items.category}</Table.Cell>
										<Table.Cell>{items.dimensions}</Table.Cell>
										<Table.Cell>{items.weight}</Table.Cell>
										<Table.Cell>{items.stock}</Table.Cell>
										<Table.Cell>{items.condition}</Table.Cell>
										<Table.Cell>
											<Link>View</Link>
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table>
					</Card>
				</div>
			</div>
		</div>
	);
}
